const { grinderAfk } = require("../attack");
const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  const bot = await startBot(dcSend);

  await grinderAfk(bot, dcSend);
};

test();
