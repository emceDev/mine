// go to destination
// check if is in inventory
// drop
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");

const { bot } = require("./botInitialize");
//console.log(bot);
const mcData = require("minecraft-data")(bot.version);
const { tossingPoint } = require("./config");

const tossItems = () => {
  console.log("Tossing proccess started.");
  bot.chat("/is home");
  return new Promise((resolve, reject) => {
    console.log("teleporting...");
    return setTimeout(() => {
      const defaultMove = new Movements(bot, mcData);
      bot.pathfinder.setMovements(defaultMove);
      console.log("going to tossing area");
      bot.pathfinder.setGoal(
        new GoalNear(tossingPoint.x, tossingPoint.y, tossingPoint.z, 1)
      );
      return bot.once("goal_reached", async () => {
        console.log("onspot");
        const itemsToss = getItems();
        bot.lookAt(
          new Vec3(tossingPoint.x, tossingPoint.y + 1, tossingPoint.z),
          true
        );
        if (getItems().length > 0) {
          console.log("number items to toss", itemsToss.length);
          return await tossItemsArr(getItems())
            .then((x) => resolve(x))
            .catch((err) => console.log(err));
        } else {
          resolve("not enough items to toss");
        }
      });
    }, 6000);
  });
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
    (x) => x.name === "sweet_berries" && x.count === 64 && x
  );

  return stacks;
}

module.exports = { tossItems };
