// const { bot } = require("./botInitialize");
// const { token, channelId, pass } = require("../Utils/config");

const { Client, GatewayIntentBits } = require("discord.js");
const { tosser } = require("./Tossing");
const { planter } = require("./TreePlanter");
const { treeCutter } = require("./treeCutter");
const { countItems, wait } = require("./util");
const { startBot } = require("./botInitialize");
const { token, channelId } = require("./config");

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
        // for (let i = 0; i < 5; i++) {
        //   console.log("goung home 2");
        //   bot.chat("/is home 2");
        //   await wait(6000); // Wait for 6 seconds
        //   console.log("cutting tree");
        //   await treeCutter(bot, dcSend);
        //   bot.chat("/is home");
        //   await wait(6000); // Wait for 6 seconds
        //   await planter(bot, dcSend);
        // }
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
          const detectionRange = 100;
          bot.on("physicsTick", () => {
            // Get a list of all entities in the bot's vicinity
            const nearbyEntities = bot.entities;

            // Filter the nearby entities to find players within the detection range
            const nearbyPlayers = Object.values(nearbyEntities).filter(
              (entity) => {
                return (
                  entity.type === "player" &&
                  bot.entity.position.distanceTo(entity.position) <=
                    detectionRange
                );
              }
            );

            for (const player of nearbyPlayers) {
              // Handle the detected player here
              console.log(
                `Detected player: ${player.username} at position: ${player.position}`
              );
              if (
                player.username !== "Jagodziarz" ||
                player.username !== "Berserker123"
              ) {
                bot.quit();
                dcSend("someone joined island: " + player.username);
              }
            }
          });
          treeCutter(bot, dcSend);
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
