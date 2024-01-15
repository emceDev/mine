const { wait } = require("../Utils/util");
const { startBot } = require("./botInitialize");
const { Resuplier } = require("./Resuplier");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  const bot = await startBot(dcSend);

  await Resuplier(bot, dcSend);
};

test();
