const { bot } = require("./botInitialize");
const {
	token,
	channelId,
	spawnPointCoords,
	portalCoords,
	pass,
} = require("./config");
const { Client, GatewayIntentBits, IntentsBitField } = require("discord.js");
const { sayItems } = require("./Chesting");
const {
	findBlocks,
	findStartBlock,
	set,
	equip,
	goNext,
	pick,
	berryClock,
	sorter,
} = require("./BerryWork");
const { tossItems } = require("./Tossing");
const { getToPortal } = require("./getToSpot");
const { beGuardian } = require("./guard");

// const intents = new Intents
let channel = undefined;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const startPicking = async () => {
	bot.chat("/is home");
	console.log("teleporting home");
	setTimeout(() => {
		findStartBlock()
			.then((startBlock) => set(startBlock))
			.then((x) => findBlocks())
			.then((blocks) => berryClock(blocks))
			.then((x) => beGuardian())
			.then((x) => console.log("resovle guardian", x))
			.then(() => startPicking())
			.catch((err) => console.log("error", err));
	}, 6000);
};
const initialize = () =>
	new Promise(async (resolve, reject) => {
		client.on("ready", () => {
			console.log(
				`The discord bot logged in! Username: ${client.user.username}!`
			);
			// Find the Discord channel messages will be sent to
			channel = client.channels.cache.get(channelId);
			if (!channelId) {
				console.log(`I could not find the channel`);
				reject("discord not find the channel ");
				process.exit(1);
			} else {
				console.log("discord channel set");
				dcSend("Initialized DC");
				setUpListeners();
				resolve({ channel, client });
			}
		});
	});
const setUpListeners = async () => {
	bot.once("spawn", () => {
		console.log("spawned running desired function");

		startPicking();
	});

	// Redirect Discord messages to in-game chat
	client.on("messageCreate", (message) => {
		// Only handle messages in specified channel
		const content = message.content;
		// console.log("message", message.content);
		// console.log(message.content);
		if (content.startsWith("start")) {
			bot.chat("is home");
			// setTimeout(() => {
			startPicking();
			// }, 6000);
		}
		if (content.startsWith("login")) {
			bot.chat(`/login ${pass}`);
			bot.chat(`/rozumiemzerobiezle`);
		}
		if (content.startsWith("portal")) {
			bot.chat("/is home");
			setTimeout(() => {
				getToPortal();
			}, 6000);
		}
		if (content.startsWith("toss")) {
			bot.chat("/is visit mateee9999");
			setTimeout(() => {
				tossItems();
			}, 6000);
		}
		if (content.startsWith("find")) {
			const name = content.split(" ")[1];
			findBlocks(name)
				.then((x) => console.log(x))
				.catch((err) => console.log("err", err));
		}
		if (content.startsWith("set")) {
			const name = content.split(" ")[1];
		}
		if (content === "items") {
			sayItems();
		}
		if (
			content === "w" ||
			content === "s" ||
			content === "d" ||
			content === "a"
		) {
			console.log("goinge");

			let direction;
			switch (content) {
				case "w":
					direction = "forward";
					break;
				case "s":
					direction = "back";
					break;
				case "d":
					direction = "left";
					break;
				case "a":
					direction = "right";
					break;
				default:
					break;
			}
			bot.setControlState(direction, true);
			setTimeout(() => {
				bot.setControlState(direction, false);
			}, 1000);
		}
		if (message.channel.id !== channel.id) return;
		// Ignore messages from the bot itself
		if (message.author.id === client.user.id) return;

		if (content.startsWith("/")) {
			console.log("komenda" + content);
			bot.chat(content);
		}
	});

	// Redirect in-game messages to Discord channel
	bot.on("whisper", (username, message) => {
		// Ignore messages from the bot itself
		if (username === bot.username) return;
		channel.send(`${username}: ${message}`);
	});

	bot.on("kicked", (res) => console.log("kicked", res));
	bot.on("end", (res) => {
		console.log(res);
	});
	bot.on("death", () => {
		channel.send("I died x.x");
	});
	bot.on("message", (mess) => {
		if (mess.extra !== undefined && mess.extra[1] !== undefined) {
			const text = mess.extra[1].text;
			const captcha = text.slice(34);
			text.includes("/login")
				? logIn()
				: text.includes("/register <haslo>")
				? bot.chat(`/register ${pass} ${pass} ${captcha}`)
				: null;
		}
	});
	const logIn = () => {
		bot.chat(`/login ${pass}`);
		setTimeout(() => {
			bot.chat("/rozumiemzerobiezle");
		}, 1000);
	};
	// bot.on("health", () => {
	// 	console.log(bot.health, "x", bot.food);
	// });
};
function dcSend(message) {
	console.log("sending");
	channel.send(message);
}
// Login Discord bot
client.login(token);
initialize();

module.exports = { client, dcSend, startPicking };
