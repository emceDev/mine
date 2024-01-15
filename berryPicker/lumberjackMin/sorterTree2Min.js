const sorter = (blocks) => {
  blocks.sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    if (a.x % 2 === 0) {
      return a.x - b.x;
    } else if (a.x % 2 !== 0) {
      return a.x - b.x;
    }
    return 0;
  });
  // console.log(blocks);
  return blocks;
};
// const defaultHarvest = "spruce_log";
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
      maxDistance: 50,
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
module.exports = { sorter, findBlocks };
