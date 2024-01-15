const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { equip } = require("./util");
const mineflayer = require("mineflayer");

const planter = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.allowSprinting = false;
    defaultMove.allowParkour = true;
    defaultMove.blocksCantBreak = new Set([
      "dirt",
      9,
      8,
      4,
      "grass_block",
      "minecraft:podzol",
      "minecraft:cobblestone",
    ]);
    bot.pathfinder.setMovements(defaultMove);

    // const startC = { x: 6110, y: 74, z: 6472 };
    // const endC = { x: 6127, y: 74, z: 6476 };
    const startC = { x: 88, y: -61, z: 116 };
    const endC = { x: 89, y: -61, z: 118 };
    const y = startC.y;
    const startX = startC.x;
    const endX = endC.x;
    const startZ = startC.z;
    const endZ = endC.z;

    // Define the size of the square
    const squareSize = 2;

    const sortRightLeft = (array) => {
      const groupedByX = array.reduce((acc, coord) => {
        const key = coord.x;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(coord);
        return acc;
      }, {});
      const sum = [];
      Object.values(groupedByX).forEach((array, index) =>
        index % 2 ? sum.push(...array) : sum.push(...array.reverse())
      );
      return sum;
    };

    const getSquares = () => {
      console.log("getSquares");
      return new Promise((resolve, reject) => {
        // Create an array to store the square coordinates
        const squares = [];

        // Determine the minimum and maximum values for X and Z
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minZ = Math.min(startZ, endZ);
        const maxZ = Math.max(startZ, endZ);

        // Loop through the coordinates to generate 2x2 squares
        for (let x = minX; x <= maxX - squareSize + 1; x += squareSize) {
          for (let z = minZ; z <= maxZ - squareSize + 1; z += squareSize) {
            // Create an array to store the coordinates of the blocks in the square
            const square = [];
            for (let i = x; i < x + squareSize; i++) {
              for (let j = z; j < z + squareSize; j++) {
                // Create an object to represent the coordinates of each block in the square
                const coordinates = { x: i, y, z: j };
                const block = bot.blockAt(
                  new Vec3(coordinates.x, coordinates.y + 1, coordinates.z)
                );

                if (block.name === "air" || block.name.includes("leaves")) {
                  // console.log("pushing", coordinates);
                  // console.log(block.name);
                  square.push(coordinates);
                }
              }
            }
            // Add the square to the squares array
            square.length === 4 && squares.push(square);
          }
        }

        // Print the array of squares

        resolve(squares);
      });
    };
    const go = (c) => {
      console.log("go", c);
      return new Promise((resolve, reject) => {
        bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 1));
        bot.once("goal_reached", () => {
          // console.log("goal_reached invoked");
          resolve();
        });
      });
    };

    const sowPlant = (plantCoords) => {
      console.log("sowPlant");
      return new Promise(async (resolve, reject) => {
        const vector = new Vec3(
          plantCoords.x,
          plantCoords.y - 1,
          plantCoords.z
        );
        // console.log("vector", vector);
        const blockToSow = bot.blockAt(vector, true);
        const blockOver = bot.blockAt(
          new Vec3(plantCoords.x, plantCoords.y, plantCoords.z)
        );
        const itemName = "spruce_sapling";
        if (blockOver.name !== "air") {
          console.log("digging", blockOver.name);
          await bot.dig(blockOver);
        }
        await equip(bot, itemName, dcSend);
        await bot.placeBlock(blockToSow, new Vec3(0, 1, 0));

        setTimeout(() => {
          resolve();
        }, 500);
      });
    };

    const sowArea = (sowArea) => {
      console.log("sowArea");
      return new Promise(async (resolve, reject) => {
        for (const plantCoords of sowArea) {
          await sowPlant(plantCoords);
        }
        resolve();
      });
    };

    const plantTree = async (treeCoords) => {
      const tree = sortRightLeft(treeCoords);
      console.log("plantTree");
      await go(tree[0]);
      console.log("on spot");
      await sowArea(tree);
      await applyBoneMeal(bot, tree[0]);
      console.log("area sown");
    };

    const plantClock = async () => {
      const x = endX - startX;
      const z = endZ - startZ;

      console.log("sowing this many saplings", Math.abs(x * z));
      return new Promise(async (resolve, reject) => {
        const trees = await getSquares();
        let treeNum = 0;
        for (const i in trees) {
          console.log("trees planted:", i);
          treeNum = i;
          await plantTree(trees[i]);
        }
        dcSend(treeNum + " trees sown");
        resolve();
      });
    };

    await plantClock();

    resolve();
  });
};
module.exports = { planter };
