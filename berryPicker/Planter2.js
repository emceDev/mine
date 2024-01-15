const { bot } = require("./botInitialize");
const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const mcData = require("minecraft-data")(bot.version);
const startC = { x: 0, y: 0, z: 0 };
const endC = { x: -11, y: 0, z: 11 };
const y = -60;
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
          square.push(coordinates);
        }
      }
      // Add the square to the squares array
      squares.push(square);
    }
  }

  // Print the array of squares
  return squares;
};

const go = (c) => {
  console.log("go");
  return new Promise((resolve, reject) => {
    bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 1));
    bot.once("goal_reached", () => {
      console.log("goal_reached invoked");
      resolve("planted");
    });
  });
};

const sowPlant = (plantCoords) => {
  console.log("sowPlant");
  return new Promise(async (resolve, reject) => {
    const vector = new Vec3(plantCoords.x, plantCoords.y - 1, plantCoords.z);
    //console.log("vector", vector);
    const blockToSow = bot.blockAt(vector, true);

    const itemName = "spruce_sapling";
    const plant = bot.inventory.findInventoryItem(itemName);

    await bot.equip(plant, "hand");
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
  await applyBoneMeal(tree[0]);
  console.log("area sown");
};

const plantClock = async () => {
  const trees = getSquares();

  //   console.log("plantClockStart");
  for (const i in trees) {
    console.log("trees planted:", i);
    await plantTree(trees[i]);
  }
};

const applyBoneMeal = async (tree) => {
  return new Promise(async (resolve, reject) => {
    const block = bot.blockAt(new Vec3(tree.x, tree.y, tree.z));
    const targetBlockPosition = block.position;
    const boneMeal = bot.inventory.findInventoryItem("bone_meal");

    await bot.equip(boneMeal, "hand");
    //applyBoneMeal(block, targetBlockPosition);
    const applyInterval = setInterval(() => {
      bot.lookAt(block.position);
      bot.activateBlock(block);
    }, 1000);
    bot.once(
      `blockUpdate:(${targetBlockPosition.x}, ${targetBlockPosition.y}, ${targetBlockPosition.z})`,
      (oldBlock, newBlock) => {
        console.log(oldBlock.type, "===>", newBlock.type);
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
bot.once("spawn", () => {
  setTimeout(() => {
    plantClock();
  }, 2000);
});
