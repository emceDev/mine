const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const {
  wait,
  equip,
  go,
  findBlocks,
  checkPrice,
  applyBoneMeal,
  sowPlant,
  shouldSupply,
} = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { safeMovements } = require("../Utils/config");

const coords = { x: 96551, y: 68, z: 14616 };
const chestCoords = { x: 96552, y: 69, z: 14613 };
const tossingPoint = { x: 96551, y: 69, z: 14613 };
// const coords = { x: 0, y: -60, z: 0 };
const closeCoords = { x: coords.x + 1, y: coords.y + 1, z: coords.z };
// const chestCoords = { x: -1, y: -61, z: 0 };
// const tossingPoint = { x: 1, y: -61, z: 1 };
const MuschroomFarmer = async (bot, dcSend) => {
  let blocksCut = 0;
  let boneMealUsed = 0;
  let profit = 0;

  return new Promise(async (resolve, reject) => {
    //   console.log(bot.inventory.items());
    const getMushrooms = async () => {
      console.log("fired");
      return new Promise(async (resolve, reject) => {
        await wait(500);
        const stem = await findBlocks(bot, "mushroom_stem", 20);
        await wait(500);
        const cap = await findBlocks(bot, "red_mushroom_block", 20);
        await wait(500);
        const center = coords;
        function compareForSpiralSorting(a, b) {
          const angleA = Math.atan2(a.z - center.z, a.x - center.x);
          const angleB = Math.atan2(b.z - center.z, b.x - center.x);
          return angleA - angleB;
        }

        x = cap.sort(compareForSpiralSorting);
        console.log(stem.length);
        console.log(cap.length);
        resolve([...stem, ...cap]);
      });
    };
    const harvestMushroom = async (shroms) => {
      // console.log(shroms.length);
      dcSend("found:" + shroms.length + "for:" + shroms.length * 9);

      return new Promise(async (resolve, reject) => {
        for (const shrom of shroms) {
          blocksCut = blocksCut + 1;
          const block = bot.blockAt(shrom);
          await equip(bot, "diamond_axe", dcSend);
          await wait(Math.floor(Math.random() * 40) + 5);
          await bot.dig(block);
        }
        resolve();
      });
    };
    const plantMushroom = async () => {
      return new Promise(async (resolve, reject) => {
        await go(bot, closeCoords, 1, safeMovements);
        await shouldSupply(bot, "red_mushroom", 32, chestCoords, 64);
        await sowPlant(bot, coords, "red_mushroom", dcSend);
        console.log("tring to aplly");
        await shouldSupply(bot, "bone_meal", 64, chestCoords, 128);
        await applyBoneMeal(bot, coords, dcSend, 100).then(
          (used) => (boneMealUsed = boneMealUsed + used)
        );

        resolve();
      });
    };
    //tosing disabled
    // (await bot.inventory.emptySlotCount()) < 5 &&
    //   (await tosser(bot, "red_mushroom_block", tossingPoint));
    await plantMushroom();
    console.log("planted");
    await harvestMushroom(await getMushrooms());
    console.log("harvested");
    profit = blocksCut * 9 - boneMealUsed * 10;
    dcSend("profit:" + profit);
    resolve(profit);
  });
};
module.exports = { MuschroomFarmer };
