const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const { host, port, username, version } = require("./config.js");
const pvp = require("mineflayer-pvp").plugin;
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
// const { findBlocks } = require("./BerryWork.js");
const startBot = (dcSend) => {
  return new Promise((resolve, reject) => {
    let mcData;
    console.log(port, host, username, version);
    let bot;

    bot = mineflayer.createBot({
      username: username,
      host: host,
      port: port,
      version: version,
    });

    console.log("initializing BOT");
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.on("inject_allowed", () => {
      console.log("injected");
      mcData = require("minecraft-data")(bot.version);
    });
    // dcSend("bot initalized");
    bot.once("spawn", () => {
      //mineflayerViewer(bot, { port: 3007, firstPerson: false });
      return resolve(bot);
    });
  });
};

module.exports = { startBot };
