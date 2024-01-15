// const { bot } = require("./botInitialize");
const { token, channelId, pass } = require("./config");
const { Client, GatewayIntentBits } = require("discord.js");
const { tosser } = require("./Tossing");
const { planter } = require("./TreePlanter");
const { treeCutter } = require("./treeCutter");
const { countItems, wait } = require("./util");
const { startBot } = require("./botInitialize");

// const intents = new Intents
let channel = undefined;
let lastTask;
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
        await wait(6000);
        dcSend("ready for commands");
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
      if (content === "plant") {
        bot.chat("/is home");
        setTimeout(() => {
          planter(bot, dcSend);
        }, 6000);
      }
      if (content === "cut") {
        bot.chat("/is home 2");

        setTimeout(() => {
          treeCutter(bot, dcSend);
        }, 3000);
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
  function dcSend(message) {
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
module.exports = { initializeCommunication };
