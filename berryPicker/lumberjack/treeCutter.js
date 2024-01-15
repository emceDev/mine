let blocks;
let finalArr;
const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { sortCoordinates } = require("./sorterTree2");
const { equip, go, isFull } = require("./util");
const { tosser } = require("./Tossing");
const { cutPoint } = require("./config");

const treeCutter = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.allowSprinting = false;
    defaultMove.allowParkour = false;
    defaultMove.canDig = true;
    defaultMove.allow1by1towers = false;
    defaultMove.bot.pathfinder.setMovements(defaultMove);
    const defaultHarvest = "spruce_log";

    const stalenessThreshold = 60000; // 60 seconds (adjust as needed)
    let lastActivityTimestamp = Date.now();

    // Function to update the last activity timestamp
    const updateActivityTimestamp = () => {
      lastActivityTimestamp = Date.now();
    };

    const monitorActivity = () => {
      // Set an interval to periodically check bot's activity
      const monitoringInterval = 10000; // Check every 10 seconds (adjust as needed)
      const int = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivityTimestamp;

        if (timeSinceLastActivity > stalenessThreshold) {
          dcSend("Bot is stale. Taking action...");
          clearInterval(int);
          resolve();
          // bot.quit();
          // clearInterval(int);
          // Perform actions to handle staleness, e.g., restart the bot.
        }
      }, monitoringInterval);
    };

    const sorter = (blocks) => {
      const floors = [];
      blocks.sort((a, b) => {
        return a.y - b.y;
      });
      return blocks;
    };
    const findBlocks = async (name = defaultHarvest) => {
      console.log("findblocks", name);

      return new Promise((resolve, reject) => {
        console.log("waiting for chunk load skipped");
        if (mcData.blocksByName[name] === undefined) {
          return reject("undefined block name");
        }
        const ids = [mcData.blocksByName[name].id];
        blocks = bot.findBlocks({
          matching: ids,
          maxDistance: 50,
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

    const cutTrees = async () => {
      return new Promise(async (resolve, reject) => {
        const blocks = await findBlocks();
        await treeClock(sortCoordinates(blocks).reverse());
        resolve();
      });
    };
    const treeClock = async (floors) => {
      return new Promise(async (resolve, reject) => {
        for (const floor of floors) {
          await loopFloor(floor);
        }
        console.log("all floors done");
        resolve();
      });
    };
    const loopFloor = async (floor) => {
      console.log("next floor");
      bot.inventory.emptySlotCount() < 2 && (await tosser(bot, "spruce_log"));
      return new Promise(async (resolve, reject) => {
        for (const coords of floor) {
          updateActivityTimestamp();
          console.log(coords);
          await go(bot, coords);
          const block = bot.blockAt(coords);
          await equip(bot, "diamond_axe", dcSend);
          block.name !== "air" && (await bot.dig(block));
        }
        console.log("loopFloor resolving");
        resolve();
      });
    };
    // const calculateDigTime = (toolName) => {
    //   return new Promise((resolve, reject) => {
    //     const tools = bot.inventory
    //       .items()
    //       .map((item) => item.name.includes(toolName));
    //   });
    // };
    const set = async () => {
      return new Promise(async (resolve, reject) => {
        const blocks = await findBlocks();
        // await calculateDigTime("axe");
        dcSend("cutting will last:" + blocks.length * 0.5);
        const coords = sortCoordinates(blocks).reverse();
        console.log("found this many blocks: ", blocks.length);
        console.log("going to first block");
        await go(bot, coords[0][0]);
        console.log("recounting blocks");
        await cutTrees();
        dcSend("trees cut");
        resolve();
      });
    };
    monitorActivity();
    await set();
  });
};
module.exports = { treeCutter };
