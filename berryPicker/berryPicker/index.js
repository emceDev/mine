const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { tosser } = require("../Utils/Tossing");
const {
  findBlocks,
  go,
  wait,
  BerrySorter,
  checkPrice,
} = require("../Utils/util");

const BerryPicker = async (bot, dcSend) => {
  const pickBerries = async (bushes) => {
    const checkX = (a, b, toggle) => {
      const curr = bot.blockAt(a).position.x;
      const next = bot.blockAt(b).position.x;
      if (curr !== next) {
        return true;
      } else if (toggle % 4 === 0) {
        return true;
      } else {
        return false;
      }
    };
    return new Promise(async (resolve, reject) => {
      let toggle = 0;
      let i = 0;
      for (const berryBush of bushes) {
        const ifGo = bushes[i - 1] && checkX(bushes[i - 1], bushes[i], toggle);
        bot.inventory.emptySlotCount() < 2 &&
          (await tosser(bot, "sweet_berries"));

        if (ifGo === true) {
          await go(bot, berryBush);
        }
        const bush = bot.blockAt(berryBush);
        if (bush.metadata >= 2) {
          await bot.activateBlock(bush);
        }
        toggle = toggle + 1;
        i = i + 1;
        await wait(Math.random() * (0.5 - 0.1) + 0.1);
      }
      resolve();
    });
  };
  return new Promise(async (resolve, reject) => {
    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.allowSprinting = false;
    defaultMove.allowParkour = false;
    defaultMove.canDig = false;
    defaultMove.allow1by1towers = false;
    defaultMove.blocksToAvoid.add(mcData.blocksByName["sweet_berry_bush"].id);
    defaultMove.bot.pathfinder.setMovements(defaultMove);
    const blocks = await findBlocks(bot, "sweet_berry_bush");
    const sortedBushes = BerrySorter(blocks);
    await checkPrice(bot, dcSend, "sweet_berry_bush");
    await pickBerries(sortedBushes);
    dcSend("picked all the berries");
    await tosser(bot, "sweet_berries");
    resolve();
  });
};

module.exports = { BerryPicker };
