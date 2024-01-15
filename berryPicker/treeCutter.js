let loop = 0;
let blocks;
let finalArr;
let paused;
const distance = 5;
const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { resolve } = require("path");
const { bot } = require("./botInitialize");
const { goToChest } = require("./Chesting");
const { tossItems } = require("./Tossing");
const { sortCoordinates } = require("./sorterTree2");
const mcData = require("minecraft-data")(bot.version);

const defaultStartBlock = "oak_planks";
const defaultHarvest = "spruce_log";

const sorter = (blocks) => {
  const floors = [];
  blocks.sort((a, b) => {
    return a.y - b.y;
  });
  return blocks;
};
const findBlocks = async (name = defaultHarvest) => {
  console.log("findblocks", name);

  return new Promise((resolve, reject) => {
    console.log("waiting for chunk load skipped");
    if (mcData.blocksByName[name] === undefined) {
      return reject("undefined block name");
    }
    const ids = [mcData.blocksByName[name].id];
    blocks = bot.findBlocks({
      matching: ids,
      maxDistance: 100,
      count: 4000,
    });
    finalArr = sorter(blocks);
    console.log("Search completed.");
    if (blocks === null) {
      return reject("no blocks found");
    } else {
      return resolve(finalArr);
    }
  });
};
const go = (c) => {
  const defaultMove = new Movements(bot, mcData);
  defaultMove.allowSprinting = false;
  defaultMove.allowParkour = true;
  defaultMove.canDig = true;
  bot.pathfinder.setMovements(defaultMove);
  // console.log("go", c);
  return new Promise((resolve, reject) => {
    bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 2));
    bot.once("goal_reached", () => {
      // console.log("goal_reached invoked");
      resolve();
    });
  });
};
const equip = async () => {
  new Promise(async (resolve, reject) => {
    let axes = [];
    for (const item of bot.inventory.items()) {
      if (item && item.name.includes("axe")) {
        axes.push(item);
      }
    }
    !bot.heldItem.name.includes("axe") &&
      axes.length() > 0 &&
      (await bot.equip(axes[0], "hand"));
    resolve();
  });
};

const set = async () => {
  console.log("setting");
  const blocks = await findBlocks();
  const coords = sortCoordinates(blocks).reverse();
  console.log("going to set");
  await go(coords[0][0]);
  console.log("proceeding to cut");
  await cutTrees();
};
const cutTrees = async () => {
  const blocks = await findBlocks();
  await treeClock(sortCoordinates(blocks).reverse());
};
const treeClock = async (floors) => {
  for (const floor of floors) {
    await loopFloor(floor);
  }
};
const loopFloor = async (floor) => {
  console.log("next floor");
  return new Promise(async (resolve, reject) => {
    for (const coords of floor) {
      await equip();
      await go(coords);
      const block = bot.blockAt(coords);
      await bot.dig(block);
    }
    resolve();
  });
};
bot.once("spawn", () => {
  setTimeout(() => {
    set();
  }, 1000);
});
