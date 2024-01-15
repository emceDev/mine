const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");

const { tossingPoint } = require("./config");
const { go } = require("./util");

const tosser = async (bot, name) => {
  const mcData = require("minecraft-data")(bot.version);
  return new Promise((resolve, reject) => {
    const tossItems = () => {
      console.log("Tossing proccess started.", name);
      bot.chat("/is home");
      return setTimeout(async () => {
        await go(bot, {
          x: tossingPoint.x,
          y: tossingPoint.y,
          z: tossingPoint.z,
        });
        console.log("onspot");
        const itemsToss = getItems();
        bot.lookAt(
          new Vec3(tossingPoint.x, tossingPoint.y + 1, tossingPoint.z),
          true
        );
        if (getItems().length > 0) {
          console.log("number items to toss", itemsToss.length);
          await tossItemsArr(getItems())
            .then((x) => resolve())
            .catch((err) => console.log(err));
        } else {
          resolve();
        }
      }, 6000);
    };

    function tossItemsArr(array) {
      return new Promise((resolve, reject) => {
        console.log("tossing out of inventory");
        let i = 0;
        const toss = () => {
          console.log("tossing", array.length, i);
          return i < array.length
            ? bot.tossStack(
                array[i],
                setTimeout(() => {
                  i++;
                  return toss();
                }, 1000)
              )
            : resolve("finished tossing");
        };

        toss();
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
