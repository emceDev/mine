const EnableAlert = (bot, whitelist, dcSend) => {
  return setInterval(() => {
    const detectionRange = 100;

    // Get a list of all entities in the bot's vicinity
    const nearbyEntities = bot.entities;

    // Filter the nearby entities to find players within the detection range
    const nearbyPlayers = Object.values(nearbyEntities).filter((entity) => {
      return (
        entity.type === "player" &&
        bot.entity.position.distanceTo(entity.position) <= detectionRange
      );
    });

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
  }, 2000);
};

module.exports = { EnableAlert };
