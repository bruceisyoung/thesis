// socket helper function: move player
module.exports = function(io, roomName, players, data) {
  const playerId = data[0];
  const direction = data[1];

  players.move(playerId, direction);

  io.to(roomName).emit('updatePlayerLocations', players.playerLocations);

}