function addPlayer(self, playerInfo) {
  //var username = prompt("Please Enter Your Name", "")

  self.player = self.physics.add.sprite(200, 850, "char1_idle").setDisplaySize(125, 125).setBounce(0.1).setCollideWorldBounds(true);

  self.player.playerId = self.socket.id;
  self.player.lives = 3;
  self.player.hitPoints = 4;
  self.player.movements = [];
  self.player.waitingForRespawn = false;
  self.player.setScale(0.2);

  self.playerCollider.add(self.player);
  //self.player.username = username;

  //TODO: SOCKET EVENT UPDATE PLAYER OBJECT WITH USERNAME MATCH ON SOCKET ID
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, "char2_idle").setDisplaySize(125, 125);

  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.username = playerInfo.username;
  otherPlayer.waitingForRespawn = playerInfo.waitingForRespawn;
  otherPlayer.movements = [];
  otherPlayer.setScale(0.2);
  otherPlayer.setTint(playerInfo.color);

  self.otherPlayers.add(otherPlayer);
}
