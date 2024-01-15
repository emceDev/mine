const { startBot } = require("./botInitialize");
const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");

const itemName = "axe";
const calculateDigSpeed = (itemName) => {
  const tools = bot.inventory
    .items()
    .map((item) => item.name.includes(itemName) && item);
  console.log(tools);
};
