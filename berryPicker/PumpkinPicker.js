let loop = 0;
let blocks;
let finalArr;
let paused;
const distance = 3;
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
const mcData = require("minecraft-data")(bot.version);

const defaultStartBlock = "oak_planks";
const defaultHarvest = "pumpkin";

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
async function findStartBlock(name = defaultStartBlock) {
  console.log("searching start block");

  return new Promise(async (resolve, reject) => {
    console.log("Chunk loading skipped");
    if (mcData.blocksByName[name] === undefined) {
      // bot.chat(`${name} is not a block name`);
      return reject(`${name} is not a block name`);
    } else {
      const ids = [mcData.blocksByName[name].id];
      const block = bot.findBlock({
        matching: ids,
        maxDistance: 200,
        count: 1,
      });
      console.log("Block search finished.");
      if (block === null) {
        reject("block not found");
      } else {
        resolve(block);
      }
    }
  });
}
function set(startblock) {
  return new Promise((resolve, reject) => {
    console.log("setting", startblock);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.blocksToAvoid.add(mcData.blocksByName["sweet_berry_bush"].id);

    defaultMove.canDig = false;
    defaultMove.blocksToAvoid.add(mcData.blocksByName["sweet_berry_bush"].id);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(
      new GoalNear(
        startblock.position.x,
        startblock.position.y + 1,
        startblock.position.z,
        1
      )
    );
    return bot.once("goal_reached", () => {
      console.log("on start point");
      return resolve("on start point");
    });
  });

  //   setTimeout(() => {
  //   	equip();
  //    berryClock();
  //   	console.log("starting after 10min");
  //   }, 5000);
  //   300000 -5min
}

async function goNext(arrayOfPoints) {
  // bot.chat("goNext");
  const RANGE_GOAL = 0;
  const defaultMove = new Movements(bot, mcData);
  defaultMove.allowSprinting = false;
  defaultMove.allowParkour = false;
  defaultMove.canDig = false;
  defaultMove.blocksToAvoid.add(mcData.blocksByName["sweet_berry_bush"].id);
  bot.pathfinder.setMovements(defaultMove);
  return new Promise((resolve, reject) => {
    let x = arrayOfPoints[loop].x - 1;
    let y = arrayOfPoints[loop].y - 1;
    let z = arrayOfPoints[loop].z;
    console.log("Go: " + x, y, z);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, RANGE_GOAL));

    return bot.once("goal_reached", () => {
      return setTimeout(async () => {
        await pick(arrayOfPoints).then((x) => resolve("loop done"));
      }, 1);
    });
  });
}

function pick(arrayOfPoints) {
  console.log("PICK", loop, "x", distance);
  let from = loop;
  let to = loop + distance;
  let iter = from;
  if (distance === loop || loop === 0) {
    from = loop + 1;
    to = loop + distance;
    console.log(arrayOfPoints[from], "x", arrayOfPoints[to]);
  } else {
    from = loop + 1;
    to = loop + distance;
    console.log(arrayOfPoints[from], "x", arrayOfPoints[to]);
  }
  return new Promise((resolve, reject) => {
    console.log("Picking...");
    let interval = setInterval(() => {
      iter = iter + 1;
      setTimeout(() => {
        console.log(arrayOfPoints[iter]);
        if (bot.blockAt(arrayOfPoints[iter]).metadata !== 1) {
          //bot.activateBlock({ position: arrayOfPoints[iter] });
          bot.dig({ position: arrayOfPoints[iter] });
        }
      }, Math.floor(Math.random() * 3) + 1);

      if (
        iter === to ||
        arrayOfPoints[iter + 1] === undefined ||
        paused === false
      ) {
        console.log("Picked.");
        clearInterval(interval);
        resolve("finished picking");
      }
    }, 250);
  });
}
function equip() {
  const itemName = "stone_pickaxe";
  const item = bot.inventory.findInventoryItem(itemName);
  return new Promise(async (resolve, reject) => {
    return item === null
      ? reject("no item in eq")
      : bot.equip(item, "hand", (err) => {
          if (err) {
            console.log("equip err", err);
            reject(`unable to equip item: ${err.message}`);
          } else {
            bot.activateItem(false);
            console.log("equipped");
            resolve("equipped", item);
          }
        });
  });
}
const isFull = () => {
  console.log("Checking if bot inventory is full...");
  return new Promise((resolve, reject) => {
    console.log("checked: ", bot.inventory.emptySlotCount() < 2);
    resolve(bot.inventory.emptySlotCount() < 2);
  });
};
async function berryClock(arrayOfPoints) {
  console.log(arrayOfPoints);
  loop = 0;
  return new Promise(async (resolve, reject) => {
    for (loop; loop + distance <= arrayOfPoints.length; ) {
      console.log("looping");

      await isFull()
        .then((full) =>
          full ? tossItems().then(goNext(arrayOfPoints)) : goNext(arrayOfPoints)
        )
        .then((x) => (loop = loop + distance));
      console.log(
        "from: ",
        loop,
        "to: ",
        loop + distance,
        "on:",
        arrayOfPoints.length
      );
      if (loop + distance >= arrayOfPoints.length) {
        await tossItems().then((x) => {
          console.log("done with berries");
          return resolve("done with berries");
        });
      }
    }
  });
}

function sorter(bushes) {
  let sorted = bushes.sort((a, b) => {
    return a.x - b.x;
  });
  let rows = [bushes[0]];

  let previous = bushes[0];
  sorted.map((bush) => {
    if (bush.x !== previous.x) {
      rows.push(bush);
      previous = bush;
    }
    previous = bush;
  });
  let arr = [];
  rows.map((row) => arr.push([{ x: row.x }]));

  let iter = 0;
  arr.forEach((row) => {
    // let ind = arr[iter][0].x;
    bushes.map((bush) => {
      bush.x === arr[iter][0].x ? arr[iter].push(bush) : null;
    });
    iter++;
  });

  // deleting first fragment
  arr.map((x) => {
    x.splice(0, 1);
  });
  let swit = false;
  let finalArr = [];
  arr.map((x) => {
    swit = !swit;
    // console.log(swit);
    swit ? finalArr.push(...x.sort(des)) : finalArr.push(...x.sort(asc));
  });
  // console.log("=====LOG TESTTOWY======");
  // finalArr.map((x) => console.log(x.x));
  // console.log("===========");
  return finalArr;

  // let ss = arr[0].sort(des);

  // finalArr[2].map((x) => console.log(x));

  function des(a, b) {
    if (a.z < b.z) {
      return -1;
    }
    if (a.z > b.z) {
      return 1;
    }
    return 0;
  }
  function asc(a, b) {
    if (a.z > b.z) {
      return -1;
    }
    if (a.z < b.z) {
      return 1;
    }
    return 0;
  }
}

function startPicking() {
  findStartBlock()
    .then((startBlock) => set(startBlock))
    .then((x) => findBlocks())
    .then((blocks) => berryClock(blocks))
    .then((x) =>
      setTimeout(() => {
        return startPicking();
      }, 5000)
    )
    .catch((err) => console.log("error", err));
}
bot.on("chat", (user, message) => {
  console.log(message);
  if (message === "set") {
    bot.chat("This Works!");
  } else if (message === "pick") {
    setTimeout(() => {
      startPicking();
    }, 4000);
  }
});
module.exports = {
  findBlocks,
  findStartBlock,
  set,
  equip,
  goNext,
  pick,
  berryClock,
  sorter,
};
