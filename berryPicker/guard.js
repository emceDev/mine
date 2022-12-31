/**
 * This bot example shows the basic usage of the mineflayer-pvp plugin for guarding a defined area from nearby mobs.
 */

const { Movements, goals } = require("mineflayer-pathfinder");
const { bot } = require("./botInitialize");
const { guardPosC } = require("./config");
bot.pvp.followRange = 1;
let guardPos = guardPosC;
// Assign the given location to be guarded
const beGuardian = () => {
	console.log("Guardian activated");

	return new Promise((resolve, reject) => {
		return setTimeout(() => {
			function guardArea() {
				console.log("guarding");
				guardPos = guardPosC;
				// We we are not currently in combat, move to the guard pos
				if (!bot.pvp.target) {
					moveToGuardPos();
				}
				bot.inventory
					.items()
					.map((item) =>
						item.name.includes(
							"sword"
								? bot.equip(bot.inventory.findInventoryItem(item.name))
								: null
						)
					);
				setTimeout(() => {
					return stopGuarding("Change of guard.");
				}, 240000);
			}

			// Cancel all pathfinder and combat
			function stopGuarding(reason = "none") {
				guardPos = null;
				bot.pvp.stop();
				bot.pathfinder.setGoal(null);
				console.log("end of guard");
				return resolve("End of guard: " + reason);
				// console.log("stopped Guarding for: ", reason);
			}

			// Pathfinder to the guard position
			function moveToGuardPos() {
				const mcData = require("minecraft-data")(bot.version);
				const defaultMove = new Movements(bot, mcData);
				defaultMove.canDig = false;
				defaultMove.allowParkour = true;
				bot.pathfinder.setMovements(defaultMove);
				bot.pathfinder.setGoal(
					new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z)
				);
			}

			// Called when the bot has killed it's target.
			bot.on("stoppedAttacking", () => {
				if (guardPos) {
					moveToGuardPos();
				}
			});

			// Check for new enemies to attack
			bot.on("physicsTick", () => {
				if (!guardPos) return; // Do nothing if bot is not guarding anything
				// console.log("tick");
				// Only look for mobs within 16 blocks
				const filter = (e) =>
					e.type === "mob" &&
					e.position.distanceTo(bot.entity.position) < 4 &&
					e.mobType !== "Armor Stand"; // Mojang classifies armor stands as mobs for some reason?
				const mcData = require("minecraft-data")(bot.version);
				const defaultMove = new Movements(bot, mcData);
				defaultMove.canDig = false;
				defaultMove.allow1by1towers = false;
				bot.pathfinder.setMovements(defaultMove);
				bot.pvp.movements = defaultMove;
				bot.pvp.attackRange = 4;
				bot.pvp.followRange = 4;
				const entity = bot.nearestEntity(filter);
				if (entity) {
					// Start attacking
					console.log(entity.name);
					entity.name === "zombie_villager"
						? stopGuarding("zombie villager spawned")
						: bot.pvp.attack(entity);
				}
			});

			guardArea();
		});
	}, 6000);
};

module.exports = { beGuardian };
