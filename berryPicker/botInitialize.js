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
let mcData;

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
bot.once("spawn", () => {
	mineflayerViewer(bot, { port: 3007, firstPerson: false });
});
module.exports = { bot };
