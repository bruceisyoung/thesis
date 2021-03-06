module.exports = function(io, socket, room, user, gameManager, users, clients) {
  console.log(gameManager.rooms[room].players.playerLocations);
  gameManager.rooms[room].players.playerLocations[user].ready = !gameManager.rooms[room].players.playerLocations[user].ready;
  socket.emit('hasToggledReady', 'ok');

  // check whehter everybody is ready
  var playerList = Object.keys(gameManager.rooms[room].players.playerLocations);
  var isAllPlayersReady = playerList.length !==0 && playerList.reduce(function(a, b) {
  	return a && gameManager.rooms[room].players.playerLocations[b].ready;
  }, true);

  if(isAllPlayersReady) {
    // calculate board size
    gameManager.startGame(room, io);

    console.log('trying to restart the game for room ', room);

    var boardSize = [gameManager.rooms[room].board.board[0].length, gameManager.rooms[room].board.board.length];

    io.to(room).emit('updateBoard', {type: 0, board: gameManager.rooms[room].board.board});
    io.emit('roomListUpdate', gameManager.listRoom());
    io.to(room).emit('updateScore', gameManager.rooms[room].currentScores);
    io.to(room).emit('updatePlayerLocations', {newLocations: gameManager.rooms[room].players.playerLocations, boardSize: boardSize});
    io.to(room).emit('updateGameTime', gameManager.rooms[room].board.time);
  }
  io.to(room).emit('roomInfoUpdate', gameManager.roomDetail(room, users, clients));
  io.to(room).emit('allPlayersReady', isAllPlayersReady);
};