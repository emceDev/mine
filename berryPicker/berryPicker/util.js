const { Vec3 } = require("vec3");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");

function sorter(bushes) {
  let sorted = bushes.sort((a, b) => {
    return a.x - b.x;
  });
  let rows = [bushes[0]];

  let previous = bushes[0];
  sorted.map((bush) => {
    if (bush.x !== previous.x) {
      rows.push(bush);
      previous = bush;
    }
    previous = bush;
  });
  let arr = [];
  rows.map((row) => arr.push([{ x: row.x }]));

  let iter = 0;
  arr.forEach((row) => {
    // let ind = arr[iter][0].x;
    bushes.map((bush) => {
      bush.x === arr[iter][0].x ? arr[iter].push(bush) : null;
    });
    iter++;
  });

  // deleting first fragment
  arr.map((x) => {
    x.splice(0, 1);
  });
  let swit = false;
  let finalArr = [];
  arr.map((x) => {
    swit = !swit;
    // console.log(swit);
    swit ? finalArr.push(...x.sort(des)) : finalArr.push(...x.sort(asc));
  });
  // console.log("=====LOG TESTTOWY======");
  // finalArr.map((x) => console.log(x.x));
  // console.log("===========");
  return finalArr;

  // let ss = arr[0].sort(des);

  // finalArr[2].map((x) => console.log(x));

  function des(a, b) {
    if (a.z < b.z) {
      return -1;
    }
    if (a.z > b.z) {
      return 1;
    }
    return 0;
  }
  function asc(a, b) {
    if (a.z > b.z) {
      return -1;
    }
    if (a.z < b.z) {
      return 1;
    }
    return 0;
  }
}
const findBlocks = async (bot, name) => {
  console.log("findblocks", name);
  const mcData = require("minecraft-data")(bot.version);
  return new Promise((resolve, reject) => {
    console.log("waiting for chunk load skipped");
    if (mcData.blocksByName[name] === undefined) {
      return reject("undefined block name");
    }
    const ids = [mcData.blocksByName[name].id];
    blocks = bot.findBlocks({
      matching: ids,
      maxDistance: 100,
      count: 4000,
    });
    finalArr = sorter(blocks);
    console.log("Search completed.");
    if (blocks === null) {
      return reject("no blocks found");
    } else {
      return resolve(finalArr);
    }
  });
};
const go = (bot, c) => {
  // console.log("go", c);
  return new Promise((resolve, reject) => {
    bot.pathfinder.setGoal(new GoalNear(c.x, c.y, c.z, 2));
    bot.once("goal_reached", () => {
      // console.log("goal_reached invoked");
      resolve();
    });
  });
};
async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = { findBlocks, go, wait, sorter };
