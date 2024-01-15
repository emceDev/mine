const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const {
  host,
  port,
  username,
  password,
  version,
  token,
  channelId,
} = require("./config.js");
const pvp = require("mineflayer-pvp").plugin;
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
// const { findBlocks } = require("./BerryWork.js");
let mcData;
console.log(port, host, username, version);
const bot = mineflayer.createBot({
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

module.exports = { bot };
