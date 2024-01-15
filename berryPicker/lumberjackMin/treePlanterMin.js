const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { equip, go, sowPlant } = require("../Utils/util");
const mineflayer = require("mineflayer");
const { startC, endC, safeMovements } = require("../Utils/config");

const treePlanter = async (bot, dcSend) => {
  console.log("treePlanter");
  return new Promise(async (resolve, reject) => {
    const generateCoordinates = () => {
      return new Promise((resolve, reject) => {
        let coordinates = [];
        for (let x = startC.x; x <= endC.x; x++) {
          for (let y = startC.y; y <= endC.y; y++) {
            for (let z = startC.z; z <= endC.z; z++) {
              coordinates.push({ x, y, z });
            }
          }
        }
        return resolve(coordinates);
      });
    };
    const applyBoneMeal = async (tree) => {
      return new Promise(async (resolve, reject) => {
        const block = bot.blockAt(new Vec3(tree.x, tree.y, tree.z));
        const targetBlockPosition = block.position;

        const applyInterval = setInterval(async () => {
          await equip(bot, "bone_meal", dcSend);
          bot.lookAt(block.position);
          bot.activateBlock(block);
        }, 1000);
        bot.once(
          `blockUpdate:(${targetBlockPosition.x}, ${targetBlockPosition.y}, ${targetBlockPosition.z})`,
          (oldBlock, newBlock) => {
            // console.log(oldBlock.type, "===>", newBlock.type);
            if (oldBlock.type !== newBlock.type) {
              clearInterval(applyInterval);
              resolve();
              //console.log("it grown");
            }
            // Log the block update in the specified format.
            //   clearInterval(applyInterval);
          }
        );
      });
    };

    const sowTree = async () => {
      return new Promise(async (resolve, reject) => {
        const coordinates = await generateCoordinates();

        const block = bot.blockAt(
          new Vec3(coordinates[0].x, coordinates[0].y, coordinates[0].z)
        );

        if (block.name !== "air") {
          console.log("tree already planted");
          resolve();
        } else {
          console.log("planting tree");
          for (const coord of coordinates) {
            await go(
              bot,
              { x: coord.x - 2, y: coord.y, z: coord.z },
              1,
              safeMovements
            );
            await sowPlant(bot, coord, "spruce_sapling");
          }
          await applyBoneMeal(coordinates[0]);
          console.log("tree sown");

          resolve();
        }
      });
    };
    await sowTree();
    resolve();
  });
};
module.exports = { treePlanter };
