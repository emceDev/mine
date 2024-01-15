const { BerryPicker } = require(".");
const { startBot } = require("./botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  bot = await startBot(dcSend);
  BerryPicker(bot, dcSend);
};
test();
