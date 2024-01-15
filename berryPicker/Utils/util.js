const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { safeMovements } = require("./config");

const findItems = (bot, itemName) => {
  return bot.inventory.items().filter((item) => {
    if (item.name === itemName) {
      if (item.maxDurability === undefined) {
        return item;
      } else if (item.nbt.value.Damage.value + 5 >= item.maxDurability) {
        console.log("item will be destroyed");
        return;
      } else {
        // console.log("item wont be destroyed");
        return item;
      }
    }
  });
};

const isFull = (bot) => {
  console.log("Checking if bot inventory is full...");
  return new Promise((resolve, reject) => {
    console.log("checked: ", bot.inventory.emptySlotCount() < 2);
    resolve(bot.inventory.emptySlotCount() < 2);
  });
};
const go = async (bot, c, distance = 2, cfg) => {
  // console.log("go", c);
  const mcData = require("minecraft-data")(bot.version);
  const defaultMove = new Movements(bot, mcData);
  const goal = new GoalNear(c.x, c.y, c.z, distance);
  if (cfg) {
    Object.keys(cfg).forEach((key) => {
      const value = cfg[key];
      // console.log(`${key}: ${value}`);
      defaultMove[key] = value;
    });
    bot.pathfinder.setMovements(defaultMove);
  }
  await bot.pathfinder.getPathTo(defaultMove, goal, 5000);
  return new Promise(async (resolve, reject) => {
    bot.pathfinder.setGoal(goal);
    bot.once("goal_reached", () => {
      // console.log("onspot");
      resolve();
    });
  });
};

const countItems = (bot, itemName) => {
  const result = {};
  const items = bot.inventory.items();

  for (const item of items) {
    if (result[item.name]) {
      // If the item is already in the result, add the counts
      result[item.name].count += item.count;
    } else {
      // If it's not in the result, add it with the count
      result[item.name] = { name: item.name, count: item.count };
    }
  }
  console.log(Object.values(result));
  // Convert the result object back to an array
  return Object.values(result);
};
const findBlocks = async (bot, name, distance = 50) => {
  console.log("findblocks", name);
  const mcData = require("minecraft-data")(bot.version);
  return new Promise((resolve, reject) => {
    // console.log("waiting for chunk load skipped");
    if (mcData.blocksByName[name] === undefined) {
      return reject("undefined block name");
    }
    const ids = [mcData.blocksByName[name].id];
    blocks = bot.findBlocks({
      matching: ids,
      maxDistance: distance,
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
const sorter = (blocks) => {
  blocks.sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    if (a.x % 2 === 0) {
      return a.x - b.x;
    } else if (a.x % 2 !== 0) {
      return a.x - b.x;
    }
    return 0;
  });
  // console.log(blocks);
  return blocks;
};
function BerrySorter(bushes) {
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
const checkPrice = async (bot, dcSend, name, price, blocksArr) => {
  return new Promise(async (resolve, reject) => {
    // console.log(name, price, blocksArr.length);
    const blocks = !blocksArr && (await findBlocks(bot, name));

    if (name === "sweet_berry_bush") {
      let grown = 0;
      blocks.forEach((bush) => bot.blockAt(bush).metadata >= 2 && grown++);
      const percent = (grown / blocks.length) * 100;
      dcSend(percent, "worth: ", grown * 6, " - ", grown * 9);
    } else if (name === "spruce_log") {
      const grown = blocksArr.length;
      dcSend(grown, "worth: ", grown * 7, " - ", grown * 9);
    } else {
      dcSend(blocks.length * price);
    }
    resolve();
  });
};
const applyBoneMeal = async (bot, coords, dcSend, interval = 1000) => {
  return new Promise(async (resolve, reject) => {
    const block = bot.blockAt(new Vec3(coords.x, coords.y, coords.z));
    const targetBlockPosition = block.position;
    let used = 0;

    let grown = false;
    apply = async () => {
      if (grown === false) {
        await equip(bot, "bone_meal", dcSend);
        bot.lookAt(block.position);
        bot.activateBlock(block);
        used = used + 1;
        await wait(interval);
        apply();
      } else {
        console.log("grown");
        return;
      }
    };
    apply();
    // const applyInterval = setInterval(async () => {
    //   bot.lookAt(block.position);
    //   bot.activateBlock(block);
    //   used = used + 1;
    // }, interval);
    const blockUpdateListener = (oldBlock, newBlock) => {
      if (oldBlock.type !== newBlock.type) {
        // clearInterval(applyInterval);
        grown = true;
        resolve(used);
      }
    };

    // Add the listener
    bot.once(
      `blockUpdate:(${targetBlockPosition.x}, ${targetBlockPosition.y}, ${targetBlockPosition.z})`,
      blockUpdateListener
    );

    // To remove the listener after it has executed once:
    function removeBlockUpdateListener() {
      bot.removeListener(
        `blockUpdate:(${targetBlockPosition.x}, ${targetBlockPosition.y}, ${targetBlockPosition.z})`,
        blockUpdateListener
      );
    }
  });
};
const sowPlant = async (bot, plantCoords, plantName, dcSend) => {
  console.log("sowPlant");
  return new Promise(async (resolve, reject) => {
    const vector = new Vec3(plantCoords.x, plantCoords.y - 1, plantCoords.z);
    // console.log("vector", vector);
    const blockToSow = bot.blockAt(vector, true);
    const blockOver = bot.blockAt(
      new Vec3(plantCoords.x, plantCoords.y, plantCoords.z)
    );
    // console.log(blockOver);
    const itemName = plantName;
    if (blockOver) {
      if (blockOver.name !== "air") {
        console.log("digging", blockOver.name);
        await bot.dig(blockOver);
      }
    }
    await equip(bot, itemName, dcSend);
    await bot.placeBlock(blockToSow, new Vec3(0, 1, 0));

    setTimeout(() => {
      resolve();
    }, 500);
  });
};
const withdrawItem = async (bot, itemName, count, chestCoords) => {
  console.log("withdrawItem", itemName, "  ", count);

  return new Promise(async (resolve, reject) => {
    const chest = bot.blockAt(
      new Vec3(chestCoords.x, chestCoords.y, chestCoords.z)
    );
    await wait(1000);
    await go(bot, chest.position, 1, safeMovements);
    console.log("at chest", chestCoords);

    const opened = await bot.openBlock(chest);
    bot.once("windowOpen", () => {
      console.log("opened");
    });
    await wait(1000);
    // comst items=

    const items = opened
      .containerItems()
      .filter((item) => item.name === itemName);
    console.log(items);
    await opened.withdraw(items[0].type, null, count);
    await opened.close();
    resolve();
    // try {
    //   await opened.withdraw(items[0].type, null, count);
    //   await wait(100);
    //   await opened.close();
    //   resolve();
    // } catch (error) {
    //   console.log(error);
    // }
  });
};
const equip = (bot, itemName, dcSend) => {
  return new Promise(async (resolve, reject) => {
    // const item = bot.inventory.findInventoryItem(itemName);
    const held = bot.inventory.slots[bot.getEquipmentDestSlot("hand")];
    // console.log(held);
    const items = findItems(bot, itemName);
    const item = items[0];
    if (held) {
      if (held.name === itemName) {
        resolve();
      }
    }
    if (item === undefined) {
      const waitForItem = setInterval(async () => {
        const it = findItems(bot, itemName)[0];
        // const it = bot.inventory.findInventoryItem(itemName);
        if (it !== undefined) {
          clearInterval(waitForItem);
          await bot.equip(it, "hand");
          console.log("item found");
          resolve();
        } else {
          dcSend("no item" + itemName);
          dcSend("begging for item" + itemName);
        }
      }, 10000);
    } else {
      // console.log("equipint", item.name);
      await bot.equip(item, "hand");
      resolve();
    }
  });
};
const shouldSupply = async (
  bot,
  itemName,
  count,
  chestCoords,
  wanted = count
) => {
  const items = bot.inventory.items();
  let invCount = 0;
  const item = items.filter((item) => item.name === itemName);
  if (item !== undefined) {
    for (const id of item) {
      invCount += id.count;
    }
  }
  console.log("Resuply:", itemName, "have", invCount, "/", wanted);
  if (item !== undefined && invCount > count) {
    return;
  } else {
    await withdrawItem(bot, itemName, wanted, chestCoords);
  }
};
async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  equip,
  isFull,
  go,
  countItems,
  wait,
  findBlocks,
  BerrySorter,
  checkPrice,
  applyBoneMeal,
  sowPlant,
  withdrawItem,
  shouldSupply,
};
