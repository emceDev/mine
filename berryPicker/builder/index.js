const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { equip, go } = require("../Utils/util");
const moveCfg = {
  allowSprinting: false,
  allowParkour: true,
  canDig: false,
  allow1by1towers: false,
  maxDropDown: 2,
  blocksCantBreak: new Set([12, 85, 81]),
  blocksToAvoid: new Set([81]),
};
const start = { x: 0, y: -60, z: 0 };
const end = { x: 6, y: -60, z: 0 };
const buildCactusFarm = async (bot, dcSend) => {
  const faceChecker = (start, end) => {
    if (start.x > end.x && start.y === end.y) {
      //'west'
      return new Vec3(-1, 0, 0);
    } else if (start.x < end.x && start.z === end.z) {
      // 'east'
      return new Vec3(1, 0, 0);
    } else if (start.x === end.x && start.z < end.z) {
      // 'north'
      return new Vec3(0, 0, 1);
    } else {
      // 'south
      return new Vec3(0, 0, -1);
    }
  };
  const generateRowCoords = async (start, end, y) => {
    const fence = [];
    const fenceToDestroy = [];
    const sandPos = [];
    const cactusPos = [];

    // Use end.x instead of length in the loop condition
    for (; start.x <= end.x; start.x++) {
      fence.push(new Vec3(start.x, y, start.z));
      if (start.x % 2) {
        fenceToDestroy.push(new Vec3(start.x, y, start.z));
      } else {
        // we add face vector to fence as it is reference block
        sandPos.push(new Vec3(start.x, y, start.z));
        cactusPos.push(new Vec3(start.x, y + 1, start.z));
      }
    }
    fenceToDestroy.reverse();
    // Return the generated coordinates
    return { fence, fenceToDestroy, sandPos, cactusPos };
  };

  const floors = 4;
  const coordinates = [];
  for (let i = 1; i < floors; i++) {
    console.log("floor", i);
    let y = end.y + 6 * i;
    let row = await generateRowCoords({ ...start }, { ...end }, y);
    coordinates.push(row);
  }
  let currFloor = 0;
  for (const floor of coordinates) {
    console.log(
      "setting on:",
      floor.fence[0].x - 1,
      floor.fence[0].y + 1,
      floor.fence[0].z
    );
    await go(
      bot,
      new Vec3(floor.fence[0].x - 1, floor.fence[0].y + 1, floor.fence[0].z),
      1,
      moveCfg
    );
    console.log("set");
    for (const fence of floor.fence) {
      console.log(fence);
      console.log("going");
      await go(bot, fence, 1, moveCfg);
      console.log("equipping");
      await equip(bot, "netherrack", dcSend);
      console.log("placing");
      await bot.placeBlock(bot.blockAt(fence), new Vec3(1, 0, 0));
    }
    console.log("fence placed");
    for (const sand of floor.sandPos) {
      console.log(sand);
      console.log("going");
      await go(bot, sand, 2, moveCfg);
      console.log("equipping");
      await equip(bot, "sand", dcSend);
      console.log("placing SAND");
      await bot.placeBlock(bot.blockAt(sand), new Vec3(0, 1, 0));
    }
    for (const gap of floor.fenceToDestroy) {
      console.log(gap);
      console.log("going");
      await go(bot, gap, 1, moveCfg);
      console.log("equipping");
      await equip(bot, "iron_pickaxe", dcSend);
      console.log("digging");
      await bot.dig(bot.blockAt(gap));
    }
    currFloor += 1;
  }
};
module.exports = { buildCactusFarm };
