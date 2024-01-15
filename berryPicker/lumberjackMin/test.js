const { Vec3 } = require("vec3");
const { tosser } = require("../Utils/Tossing");
const { startBot } = require("./botInitialize");
const { treeCutter } = require("./treeCutterMin");
const { treePlanter } = require("./treePlanterMin");
const {
  Movements,
  goals: { GoalNear },
  pathfinder,
} = require("mineflayer-pathfinder");
const { go, findBlocks, equip, wait } = require("../Utils/util");
const { safeMovements, fastMovemets } = require("../Utils/config");
const { LumberJackMin } = require(".");
// initializeCommunication();
const testDigCoords = [
  { x: 88, y: -59, z: 138 },
  { x: 89, y: -59, z: 137 },
  { x: 88, y: -59, z: 137 },
  { x: 89, y: -59, z: 138 },
];

const areVec3Equal = (vec1, vec2) => {
  console.log(vec1, " vs ", vec2);
  return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
};
const canSeeBlock = async (bot, targetPosition) => {
  return new Promise(async (resolve, reject) => {
    await bot.lookAt(targetPosition);
    await wait(500);
    const lookinAt = bot.blockAtCursor(4);

    if (lookinAt) {
      const canSee = areVec3Equal(targetPosition, lookinAt.position);

      if (canSee) {
        resolve();
      } else {
        // If the bot cannot see the target block, check if there is an obstacle in the way
        const obstacle = bot.blockInSight();

        if (obstacle) {
          // Destroy the obstacle before retrying to see the target block
          await bot.dig(obstacle);
        } else {
          // If no obstacle is in the way, wait and try again
          await wait(500);
        }

        await canSeeBlock(bot, targetPosition);
        resolve();
      }
    } else {
      console.log("Looking at air or null");
      resolve();
    }
  });
};
const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };

  bot = await startBot(dcSend);

  // bot.chat("/tp 88 -58 140");
  return new Promise(async (resolve, reject) => {
    await bot.waitForChunksToLoad();
    bot.chat("/tp 88 -60 116");
    // await treeCutter(bot, dcSend);
    await treePlanter(bot, dcSend);
    // for (let i = 0; i < 100; i++) {
    //   console.log(i);
    //   await treePlanter(bot, dcSend);
    //   // bot.inventory.emptySlotCount() < 5 && (await tosser(bot, "spruce_log"));
    //   // bot.chat("/tp 83 -33 116");

    //   await treeCutter(bot, dcSend);
    //   bot.inventory.emptySlotCount() < 5 && (await tosser(bot, "spruce_log"));
    //   dcSend("Planted and cut succesfully");
    //   resolve();
    // }
  });
};

test();
