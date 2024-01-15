const { grinderAfk } = require(".");
const { wait } = require("../Utils/util");
const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };

  bot = await startBot(dcSend);
  await wait(1000);
  await grinderAfk(bot, dcSend);
};

test();
