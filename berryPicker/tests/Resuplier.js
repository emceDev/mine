const { findBlocks, go, wait } = require("../Utils/util");
const { safeMovements } = require("./config");
const { Vec3 } = require("vec3");
const openChest = (bot, chest) => {};
const findChest = (bot, chest) => {};
const withdrawItem = async (bot, itemName, count, chestCoords = false) => {
  return new Promise(async (resolve, reject) => {
    const chest = bot.blockAt(
      new Vec3(chestCoords.x, chestCoords.y, chestCoords.z)
    );
    await wait(1000);
    await go(bot, chest.position, 1, safeMovements);
    console.log("at chest");
    await wait(1000);
    const opened = await bot.openChest(chest);
    const items = opened.items().filter((item) => item.name === itemName);
    try {
      await opened.withdraw(items[0].type, null, count);
      await wait(100);
      await opened.close();
      resolve();
    } catch (error) {
      console.log(err);
    }
  });
};
const Resuplier = (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    console.log("happened");
    bot.chat("/tp 10 -60 2");
    await withdrawItem(bot, "bone_meal", 64, false);
  });
};
module.exports = { Resuplier };
// , { x: 9, y: -60, z: 15 }
