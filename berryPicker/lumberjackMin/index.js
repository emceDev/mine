const { wait } = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { treeCutter } = require("./treeCutterMin");
const { treePlanter } = require("./treePlanterMin");

// initializeCommunication();
const LumberJackMin = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < 100; i++) {
      bot.chat("/is home");
      console.log("tping home");
      await wait(4000);
      await treePlanter(bot, dcSend);
      bot.inventory.emptySlotCount() < 5 && (await tosser(bot, "spruce_log"));

      // bot.chat("/tp 83 -33 116");
      await wait(4000);
      await treeCutter(bot, dcSend);
      bot.inventory.emptySlotCount() < 5 && (await tosser(bot, "spruce_log"));
      dcSend("Planted and cut succesfully");
      resolve();
    }
  });
};
module.exports = { LumberJackMin };
