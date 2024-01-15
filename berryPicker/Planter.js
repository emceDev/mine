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

// useful for planting and wood pecking
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

const go = async (c) => {
  console.log("go");
  return new Promise((resolve, reject) => {
    bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 1));
    return bot.once("goal_reached", () => {
      console.log("goal_reach invoked");
      resolve("planted");
    });
  });
};

const sowPlant = async (plantCoords) => {
  console.log("sowPlant");
  return new Promise(async (resolve, reject) => {
    const vector = new Vec3(plantCoords.x, plantCoords.y - 1, plantCoords.z);
    console.log("vector", vector);
    const blockToSow = bot.blockAt(vector, true);

    const itemName = "spruce_sapling";
    const plant = bot.inventory.findInventoryItem(itemName);
    return await bot.equip(plant, "hand").then(
      bot.placeBlock(blockToSow, new Vec3(0, 1, 0)).then(() =>
        setTimeout(() => {
          resolve();
        }, 2000)
      )
    );
  });
};
const sowArea = async (sowArea) => {
  console.log("sowArea");
  return new Promise(async (resolve, reject) => {
    for (const plantCoords of sowArea) {
      console.log("sowing one plant at sow are");
      await sowPlant(plantCoords).then((x) => resolve("sown"));
    }
  });
};
const plantTree = async (treeCoords) => {
  const tree = sortRightLeft(treeCoords);
  console.log("plantTree");
  return new Promise(async (resolve, reject) => {
    await go(tree[0])
      .then(() => console.log("on spot"))
      .then(() => {
        sowArea(tree);
      })
      .then((x) => console.log("are sown"))
      .then((x) => resolve());
  });
};

const plantClock = async () => {
  const trees = getSquares();
  console.log("plantClockStart");
  for (i in trees) {
    console.log("trees planted:", i);
    await plantTree(trees[i]);
  }
};
bot.once("spawn", () => {
  setTimeout(() => {
    plantClock();
  }, 2000);
});
