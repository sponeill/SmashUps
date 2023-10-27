function shoot(self, player) {
  var bullet;

  if (facingRight) {
    bullet = self.bullets.create(player.x + 75, player.y - 10, "bullet");
    bullet.setVelocityX(1000);
  } else {
    bullet = self.bullets.create(player.x - 75, player.y - 10, "bullet");
    bullet.setVelocityX(-1000);
  }

  bullet.id = generateRandomId();
  bullet.setDisplaySize(20, 10);
  bullet.playerId = player.playerId;
  bullet.body.onWorldBounds = true;
  bullet.facingRight = facingRight;

  var dataToSend = {
    x: bullet.x,
    y: bullet.y,
    id: bullet.id,
    playerId: bullet.playerId,
    facingRight: facingRight,
  };

  self.socket.emit("bulletCreated", dataToSend);
}

function playerHit(self, player, bullet) {
  bullet.destroy();

  console.log("PLAYER " + player.playerId + " HIT BY PLAYER " + bullet.playerId + " AND BULLET " + bullet.id);

  player.hitPoints = player.hitPoints - 1;

  switch (player.hitPoints) {
    case 3:
      healthFour.setVisible(false);
      break;
    case 2:
      healthThree.setVisible(false);
      break;
    case 1:
      healthTwo.setVisible(false);
      break;
    case 0:
      healthOne.setVisible(false);
      die(player);
      break;
  }
}

function die(player) {
  waitingForRespawn = true;
  player.anims.play("char1_dead", false);
  subtractLife(player);
  respawn();
}

function subtractLife(player) {
  switch (lives) {
    case 3:
      livesThree.setVisible(false);
      lives--;
      player.hitPoints = 4;
      resetHealthMeter();
      break;
    case 2:
      livesTwo.setVisible(false);
      lives--;
      player.hitPoints = 4;
      resetHealthMeter();
      break;
    case 1:
      livesOne.setVisible(false);
      lives--;
      break;
  }
}

function respawn() {
  setTimeout(function () {
    if (lives > 0) {
      waitingForRespawn = false;
      resetHealthMeter();
    }
  }, 5000);
}

function resetHealthMeter() {
  if (!waitingForRespawn) {
    healthFour.setVisible(true);
    healthThree.setVisible(true);
    healthTwo.setVisible(true);
    healthOne.setVisible(true);
  }
}

function otherPlayerHit(self, player, bullet) {
  bullet.destroy();
}

function arrowUp(self) {
  self.player.setVelocityY(-750);
}
