const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { go, wait } = require("./util");
const { tossingPoint } = require("./config");

const tosser = async (bot, name, coords = tossingPoint) => {
  return new Promise((resolve, reject) => {
    const tossItems = () => {
      console.log("Tossing proccess started.", name);
      return setTimeout(async () => {
        await go(
          bot,
          {
            x: coords.x,
            y: coords.y,
            z: coords.z,
          },
          1
        );
        console.log("onspot");
        const itemsToss = getItems();
        bot.lookAt(new Vec3(coords.x - 1, coords.y + 1, coords.z), true);
        if (getItems().length > 0) {
          console.log("number items to toss", itemsToss.length);
          await tossItemsArr(getItems())
            .then((x) => resolve())
            .catch((err) => console.log(err));
        } else {
          console.log("tossed items success");
          resolve();
        }
      }, 6000);
    };

    function tossItemsArr(array) {
      return new Promise(async (resolve, reject) => {
        console.log("tossing out of inventory");
        console.log(array);
        for (const stack of array) {
          bot.tossStack(stack);
          await wait(1000);
        }
        console.log("tossed", array.length);
        resolve();
      });
    }
    function getItems() {
      items = bot.inventory.items();
      const stacks = items.filter(
        (x) => x.name === name && x.count === 64 && x
      );

      return stacks;
    }
    tossItems();
  });
};

module.exports = { tosser };
