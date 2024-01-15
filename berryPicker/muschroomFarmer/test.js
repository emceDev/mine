const { MuschroomFarmer } = require(".");
const { wait } = require("../Utils/util");
const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  const bot = await startBot(dcSend);
  for (let i = 0; i < 100; i++) {
    await MuschroomFarmer(bot, dcSend);
  }
};

test();
