let loop = 0;
let blocks;
let startblock;
let finalArr;
let paused;
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
// const { bot } = require("./botInitialize");
// chest related shiet
const chester = (bot) => {
  return new Promise((resolve, reject) => {
    const mcData = require("minecraft-data")(bot.version);

    function countItems() {
      items = bot.inventory.items();
      let count = 0;
      items.map((x) =>
        x.name === "sweet_berries" ? (count = count + x.count) : null
      );
      console.log(count);
      return count;
    }
    function sayItems(items = bot.inventory.items()) {
      const output = items.map(itemToString).join(", ");
      let count = 0;
      items.map((x) =>
        x.name === "sweet_berries" ? (count = count + x.count) : null
      );
      if (output) {
        console.log(output);
        // bot.chat(output);
      } else {
        // bot.chat("empty");
      }
    }
    function goToChest() {
      // watchChest(false, ["chest", "ender_chest", "trapped_chest"]);
      let blocks = ["chest", "ender_chest", "trapped_chest"];
      chestToOpen = bot.findBlock({
        matching: blocks.map((name) => mcData.blocksByName[name].id),
        maxDistance: 300,
      });
      if (!chestToOpen) {
        channel.send("no chest found");
        return;
      }
      bot.pathfinder.setGoal(
        new GoalNear(
          chestToOpen.position.x,
          chestToOpen.position.y,
          chestToOpen.position.z,
          2
        )
      );
      bot.once("goal_reached", () => {
        watchChest(chestToOpen);
      });
    }
    async function watchChest(chestToOpen) {
      let amount = countItems();
      console.log("chest to open");
      // console.log(chestToOpen);

      chest = await bot.openChest(chestToOpen);

      setTimeout(() => {
        sayItems(chest.items());
        depositItem();
        chest.on("close", () => {
          console.log("chest closed");
        });
      }, 1000);

      function closeChest() {
        chest.close();
      }

      async function withdrawItem(name, amount) {
        const item = itemByName(chest.containerItems(), name);
        if (item) {
          try {
            await chest.withdraw(item.type, null, amount);
            channel.send(`withdrew ${amount} ${item.name}`);
          } catch (err) {
            channel.send(`unable to withdraw ${amount} ${item.name}`);
          }
        } else {
          channel.send(`unknown item ${name}`);
        }
      }

      async function depositItem() {
        const item = itemByName(chest.items(), "sweet_berries");
        let berry_stacks = [];
        if (item) {
          let botItems = bot.inventory.items();
          botItems.map(async (x) => {
            if (x.name === "sweet_berries") {
              berry_stacks.push(x);
            }
          });
          console.log(berry_stacks[0]);
          let put_inter = setInterval(() => {
            console.log(berry_stacks[0]);
            if (berry_stacks.length === 0) {
              clearInterval(put_inter);
              closeChest();
              setTimeout(() => {
                toGo();
              }, 500);
            } else {
              chest.deposit(berry_stacks[0].type, null, berry_stacks[0].count);
              berry_stacks.shift();
            }
          }, 1000);
          null;
        } else {
          channel.send(`unknown item `);
        }
      }
    }

    function itemToString(item) {
      if (item) {
        return `${item.name} x ${item.count}`;
      } else {
        return "(nothing)";
      }
    }

    function itemByType(items, type) {
      let item;
      let i;
      for (i = 0; i < items.length; ++i) {
        item = items[i];
        if (item && item.type === type) return item;
      }
      return null;
    }

    function itemByName(items, name) {
      let item;
      let i;
      for (i = 0; i < items.length; ++i) {
        item = items[i];
        if (item && item.name === name) return item;
      }
      return null;
    }
  });
};
module.exports = {
  sayItems,
  goToChest,
  watchChest,
  itemToString,
  itemByType,
  itemByName,
};
