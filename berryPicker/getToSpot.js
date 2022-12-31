const { bot } = require("./botInitialize");
const { portalCoords } = require("./config");
const {
	pathfinder,
	Movements,
	goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
mcData = require("minecraft-data")(bot.version);

const getToPortal = () =>
	new Promise((resolve, reject) => {
		try {
			let i = 0;
			const go = () => {
				const array = portalCoords;
				console.log("going to portal,", array[i]);

				if (i < array.length) {
					bot.pathfinder.setGoal(
						new GoalNear(array[i].x, array[i].y, array[i].z, 1)
					);
					return bot.once("goal_reached", () => {
						return setTimeout(() => {
							i++;
							return go();
						}, 100);
					});
				} else {
					return resolve("onSpot");
				}
			};
			return go();
		} catch (error) {
			console.log(error);
		}
	});

module.exports = { getToPortal };
