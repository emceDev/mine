const mineflayer = require("mineflayer");
const { port, host, username, pass, fishPond } = require("./config");
const {
	pathfinder,
	Movements,
	goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { bot } = require("./botInitialize");

const mcData = require("minecraft-data")(bot.version);

const beFisherman = async () => {
	return new Promise((resolve, reject) => {
		let nowFishing = false;
		const botGoPond = () => {
			return new Promise((resolve, reject) => {
				const defaultMove = new Movements(bot, mcData);
				defaultMove.canDig = false;
				defaultMove.allow1by1towers = false;
				bot.pathfinder.setMovements(defaultMove);
				bot.pathfinder.setGoal(
					new GoalNear(fishPond.x, fishPond.y, fishPond.z, 1)
				);
				bot.once("goal_reached", () => {
					resolve("bot on spot start fishing");
				});
			});
		};
		setTimeout(() => {
			stopFishing();
			resolve("fished");
		}, 480000);
		function onCollect(player, entity) {
			if (player === bot.entity) {
				bot.removeListener("playerCollect", onCollect);
				console.log("on collect");
				setTimeout(() => {
					startFishing();
				}, 2000);
			}
		}

		async function startFishing() {
			console.log("Fishing");
			try {
				await bot.equip(mcData.itemsByName.fishing_rod.id, "hand");
			} catch (err) {
				return console.log(err.message);
			}

			nowFishing = true;
			bot.on("playerCollect", onCollect);

			try {
				console.log("looking at: z ", fishPond.z - 2);

				bot.blockAt(new Vec3(fishPond.x, fishPond.y - 1, fishPond.z - 2))
					.name === "water" &&
					(await bot
						.lookAt(new Vec3(fishPond.x, fishPond.y - 1, fishPond.z - 2))
						.then((x) => bot.fish()));
			} catch (err) {
				console.log(err.message);
			}
			nowFishing = false;
		}

		function stopFishing() {
			bot.removeListener("playerCollect", onCollect);

			if (nowFishing) {
				bot.activateItem();
			}
		}
		botGoPond().then((x) => startFishing());
	});
};

setTimeout(() => {
	beFisherman().then((x) => console.log("resolved:", x));
}, 4000);
