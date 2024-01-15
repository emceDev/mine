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
  withdrawItem,
} = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { safeMovements } = require("../Utils/config");

const coords = { x: 6135, y: 68, z: 6411 };
// const coords = { x: 9, y: -60, z: 9 };
const plantStart = { x: 6135, y: 68, z: 6441 };
const closeCoords = { x: coords.x, y: coords.y, z: coords.z + 1 };
const chestCoords = { x: 6131, y: 68, z: 6440 };
// const plantStart = { x: 1, y: -61, z: 6 };
// const chestCoords = { x: 9, y: -60, z: 15 };
const plantNum = 10;
const MuschroomFarmerMax = async (bot, dcSend) => {
  let blocksCut = 0;
  let boneMealUsed = 0;
  let profit = 0;
  let time;
  return new Promise(async (resolve, reject) => {
    //   console.log(bot.inventory.items());
    const getMushrooms = async () => {
      console.log("fired");
      // const sortMushrooms = (arr) => {
      //   const x = arr.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.z - b.z));
      //   return x;
      // };
      const sortMushrooms = (arr) => {
        const x = arr.sort((a, b) => (a.z !== b.z ? a.z - b.z : a.x - b.x));
        return x;
      };
      return new Promise(async (resolve, reject) => {
        await wait(1000);
        const stem = await findBlocks(bot, "mushroom_stem");
        await wait(1000);
        const cap = await findBlocks(bot, "red_mushroom_block");
        await wait(1000);

        resolve(sortMushrooms([...stem, ...cap]));
      });
    };
    const harvestMushroom = async (shroms) => {
      // console.log(shroms);
      dcSend("found:" + shroms.length + "for:" + shroms.length * 9);
      return new Promise(async (resolve, reject) => {
        for (const shrom of shroms) {
          await go(bot, shrom, 5, safeMovements);
          console.log("harvesting:", shrom);
          blocksCut = blocksCut + 1;
          const block = bot.blockAt(shrom);
          await equip(bot, "diamond_axe", dcSend);
          await wait(5);
          await bot.dig(block);
        }
        resolve();
      });
    };
    const plantMushroom = async () => {
      const generateCoords = () => {
        const spacing = 3;
        const direction = "z";
        const plantNum = 10;
        const coordsArr = [];
        let c = { ...plantStart };
        for (let i = 0; i < plantNum * spacing; i++) {
          coordsArr.push({ ...c });
          if (direction === "x") {
            c.x += spacing;
          } else if (direction === "z") {
            c.z += spacing;
          }
          i += spacing;
        }

        return coordsArr;
      };
      return new Promise(async (resolve, reject) => {
        const coords = generateCoords();
        // console.log(coords);
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
        for (const coord of coords) {
          console.log(coord);
          await shouldSupply("red_mushroom", 32, chestCoords, 64);
          await shouldSupply("bone_meal", 200, chestCoords, 256);
          await go(bot, coord, 1, safeMovements);
          console.log("onspot to sow");

          await sowPlant(bot, coord, "red_mushroom", dcSend);
          console.log("tring to aplly");

          await applyBoneMeal(bot, coord, dcSend, 400).then(
            (used) => (boneMealUsed = boneMealUsed + used)
          );
        }
        resolve();
      });
    };
    //bot.chat("/tp -17 -44 1");
    // await getMushrooms();

    time = Date.now();
    await plantMushroom();
    console.log("planted");
    bot.chat("/is home 3");
    await wait(5000);
    await harvestMushroom(await getMushrooms());
    console.log("harvested");
    profit = blocksCut * 9 - boneMealUsed * 10;
    time = Date.now() - time;
    dcSend("profit:" + profit);
    dcSend(time / 1000);
    resolve(profit, time);
  });
};
module.exports = { MuschroomFarmerMax };
