const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");

const equip = (bot, itemName, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const item = bot.inventory.findInventoryItem(itemName);
    if (item === null) {
      dcSend("no item", itemName);

      const waitForItem = setInterval(async () => {
        const it = bot.inventory.findInventoryItem(itemName);
        if (it) {
          clearInterval(waitForItem);
          await bot.equip(it, "hand");
          console.log("item found");
          resolve();
        } else {
          dcSend("begging for item", itemName);
        }
      }, 2000);
    } else {
      await bot.equip(item, "hand");
      resolve();
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
const go = (bot, c) => {
  // console.log("go", c);
  return new Promise((resolve, reject) => {
    bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 2));
    bot.once("goal_reached", () => {
      // console.log("goal_reached invoked");
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
async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = { equip, isFull, go, countItems, wait };
