// const { bot } = require("./botInitialize");
// const { token, channelId, pass } = require("./config");

const { Client, GatewayIntentBits } = require("discord.js");
// const { countItems, wait } = require("./util");

const { startBot } = require("./botInitialize");
const { LumberJackMin } = require("../lumberjackMin");
const { BerryPicker } = require("../berryPicker");
const { tosser } = require("../Utils/Tossing");
const { EnableAlert } = require("../Utils/Botalert");
const { countItems, wait, checkPrice, equip } = require("../Utils/util");
const { token, channelId, pass } = require("../Utils/config");
const { MuschroomFarmer } = require("../muschroomFarmer");
const { MuschroomFarmerMax } = require("../mushroomFarmerMax");
const { grinderAfk } = require("../attack");

// const intents = new Intents
let channel = undefined;
let lastTask;
let alert;
const initializeCommunication = () => {
  let bot;
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  new Promise(async (resolve, reject) => {
    client.on("ready", () => {
      console.log(
        `The discord bot logged in! Username: ${client.user.username}!`
      );
      // Find the Discord channel messages will be sent to
      channel = client.channels.cache.get(channelId);
      if (!channelId) {
        console.log(`I could not find the channel`);
        reject("discord not find the channel ");
        process.exit(1);
      } else {
        console.log("discord channel set");
        dcSend("Initialized DC");
        setUpListeners();
        resolve({ channel, client });
      }
    });
  });

  const setUpListeners = async () => {
    const logIn = () => {
      bot.chat(`/login ${pass}`);
    };
    // Redirect Discord messages to in-game chat
    client.on("messageCreate", async (message) => {
      const content = message.content;

      if (content.startsWith("start")) {
        bot = await startBot(dcSend);
        botEvents(bot);
        console.log("login in");
        bot.chat(`/login ${pass}`);
        dcSend("ready for commands");
      }
      if (content.startsWith("Lumb")) {
        LumberJackMin(bot, dcSend);
      }
      if (content.startsWith("Guard")) {
        const bot = await startBot(dcSend);
        await wait(4000);
        bot.chat("/login minecraft123");
        await wait(4000);
        bot.chat("/zmienserwer skyblock");
        await wait(4000);
        bot.chat("/is home");
        await wait(4000);
        await grinderAfk(bot, dcSend);
      }
      if (content.startsWith("Attack")) {
        bot.chat("/is home 3");
      }
      if (content.startsWith("Mush")) {
        bot.chat("/is home 3");

        await wait(5000);
        let profit = 0;
        console.log("earned");
        for (let i = 0; i < 100; i++) {
          profit += await MuschroomFarmer(bot, dcSend);
          console.log("profit", profit);
        }
      }

      if (content.startsWith("Berry")) {
        bot.chat("/is home 3");
        await equip(bot, "iron_axe", dcSend);
        setTimeout(() => {
          BerryPicker(bot, dcSend);
        }, 3000);
      }
      if (content.startsWith("Price")) {
        const name = content.split(" ")[1];
        const price = content.split(" ")[2];
        checkPrice(bot, dcSend, name, price);
      }
      if (content.startsWith("Alert")) {
        alert = EnableAlert(bot, dcSend);
      }
      if (content.startsWith("AlertOff")) {
        clearInterval(alert);
      }
      if (content.startsWith("restart")) {
        bot.quit();
        bot = await startBot(dcSend);
        botEvents(bot);
        logIn();
      }
      if (content.startsWith("home")) {
        bot.chat("/is home");
      }
      if (content.startsWith("login")) {
        bot.chat(`/login ${pass}`);
      }
      if (content.startsWith("toss")) {
        bot.chat("/is home");
        const mess = content.split(" ");
        const itemName = mess[1];
        console.log(mess[1]);
        setTimeout(async () => {
          await tosser(bot, itemName);
        }, 6000);
      }
      if (content === "items") {
        const items = JSON.stringify(countItems(bot));
        dcSend(items);
      }
      if (content === "quit") {
        bot.quit();
      }
      if (
        content === "w" ||
        content === "s" ||
        content === "d" ||
        content === "a"
      ) {
        console.log("goinge");

        let direction;
        switch (content) {
          case "w":
            direction = "forward";
            break;
          case "s":
            direction = "back";
            break;
          case "d":
            direction = "left";
            break;
          case "a":
            direction = "right";
            break;
          default:
            break;
        }
        bot.setControlState(direction, true);
        setTimeout(() => {
          bot.setControlState(direction, false);
        }, 1000);
      }
      if (message.channel.id !== channel.id) return;
      // Ignore messages from the bot itself
      if (message.author.id === client.user.id) return;

      if (content.startsWith("/")) {
        console.log("komenda" + content);
        bot.chat(content);
      }
    });
  };
  function dcSend(...message) {
    console.log("sending to dc");
    console.log(message);
    // channel.send("messages");
    channel.send(JSON.stringify(message));
  }
  const botEvents = () => {
    bot.on("whisper", (username, message) => {
      // Ignore messages from the bot itself
      if (username === bot.username) return;
      channel.send(`${username}: ${message}`);
    });

    bot.on("kicked", (res) => console.log("kicked", res));
    bot.on("end", (res) => {
      console.log("end", res);
    });
    bot.on("death", () => {
      channel.send("I died x.x");
    });
  };
  // Login Discord bot
  client.login(token);
};
initializeCommunication();
module.exports = { initializeCommunication };
