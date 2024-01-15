const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { wait, equip, go, findBlocks, checkPrice } = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { safeMovements } = require("../Utils/config");

const treeCutter = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const mcData = require("minecraft-data")(bot.version);

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
    const cutTree = async (blocks) => {
      bot.inventory.emptySlotCount() < 2 && (await tosser(bot, "spruce_log"));

      return new Promise(async (resolve, reject) => {
        for (const coord of blocks) {
          const block = bot.blockAt(coord);
          if (block.name !== "air") {
            await equip(bot, "diamond_axe", dcSend);
            block && (await go(bot, coord, 2, safeMovements));
            const canSee = bot.canSeeBlock(block);
            await bot.lookAt(block.position);
            // console.log(canSee);
            const lookinAt = bot.blockAtCursor(2);
            !canSee &&
              lookinAt &&
              lookinAt.name !== "podzol" &&
              (await bot.dig(bot.blockAtCursor(2)));
            block && (await bot.dig(block));
          }
        }
        console.log("tree cut. cut tree resolving");
        resolve();
      });
    };
    const set = async () => {
      return new Promise(async (resolve, reject) => {
        // bot.chat("/tp 104 -31 112");

        bot.chat("/is home 2");
        console.log("1");
        await wait(5000);
        console.log("2");
        const blocksNotReversed = await findBlocks(bot, "spruce_log");
        const blocks = blocksNotReversed.reverse();
        dcSend("cutting will last:" + blocks.length * 0.3);
        console.log("found this many blocks: ", blocks.length);
        await checkPrice(bot, dcSend, "spruce_log", 7, blocks);
        console.log("setting in 5");
        await wait(5000);
        await go(bot, blocks[0], 0, safeMovements);
        await cutTree(blocks);
        dcSend("trees cut");
        resolve();
      });
    };
    // monitorActivity();
    await set();
    resolve();
  });
};
module.exports = { treeCutter };
