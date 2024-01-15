const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { equip, go, wait } = require("../Utils/util");

const grinderAfk = async (bot, dcSend) => {
  bot.on("entitySpawn", (e) =>
    e.type === "animal"
      ? dcSend("spawned " + e.name)
      : e.type === "hostile" &&
        e.name === "zombie_villager" &&
        dcSend("spawned " + e.name)
  );

  const int = setInterval(attackEntitiesInRange, 1000);

  // Function to find and attack entities within the specified distance
  const getEntitiesToAttack = async () => {
    let entitiesToAttack = [];
    const entities = bot.entities;
    // console.log(typeof entities);
    // console.log(Object.values(entities));
    if (entities.length <= 1) {
      return [0];
    } else if (
      Object.values(entities).some(
        (entity) => entity.name === "zombie_villager"
      )
    ) {
      clearInterval(int);
      dcSend("found villager");
      return [];
    } else {
      for (const entityId in entities) {
        if (entities.hasOwnProperty(entityId)) {
          const entity = entities[entityId];
          const distance = entity.position.distanceTo(bot.entity.position);
          if (distance < 6 && entity.kind === "Hostile mobs") {
            entitiesToAttack.push(entity);
          }
        }
      }
    }
    return entitiesToAttack;
  };
  async function attackEntitiesInRange() {
    const nearbyEntities = await getEntitiesToAttack();
    await equip(bot, "stone_sword", dcSend);
    if (nearbyEntities.length > 0) {
      const targetEntity = nearbyEntities[0];
      bot.lookAt(targetEntity.position.offset(0, targetEntity.height, 0));
      bot.attack(targetEntity);
      console.log(`Attacking entity ${targetEntity.name}`);
    } else {
      // console.log("No nearby entities to attack.");
    }
    await wait(Math.floor(Math.random() * (2000 - 1500 + 1)) + 1500);
  }
};

module.exports = { grinderAfk };
