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

function hitByArrow(player, arrow) {
  if (arrow.playerId != player.playerId) {
    arrow.destroy();
    die(player);
  }
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
      die(player, null);
      break;
  }
}

function explosionOverlap(player, explosion) {
  explosionCollider.active = false;

  setTimeout(function () {
    explosionCollider.active = true;
  }, 5000);

  if (explosion.playerId != player.playerId) {
    die(player);
  }
}

function carOverlap(player, car) {
  carCollider.active = false;

  setTimeout(function () {
    carCollider.active = true;
  }, 2000);

  if (car.playerId != player.playerId) {
    die(player);
  }
}

function die(player) {
  healthFour.setVisible(false);
  healthThree.setVisible(false);
  healthTwo.setVisible(false);
  healthOne.setVisible(false);

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

function rocketLaunch(playerId) {
  var launchRocket = rocket.create(-100, 800, "rocket");
  launchRocket.setVelocityY(-1200);
  launchRocket.setVelocityX(600);
  launchRocket.setScale(1.75);
  launchRocket.setRotation(0.32);
  launchRocket.anims.play("rocket");

  setTimeout(() => {
    launchRocket.destroy();

    var returnRocket = rocket.create(800, -300, "rocket");
    returnRocket.playerId = playerId;
    returnRocket.setVelocityY(600);
    returnRocket.setScale(1);
    returnRocket.setRotation(3);
    returnRocket.anims.play("rocket");
  }, "1500");
}

function driveBy(playerId) {
  var car = cars.create(-100, 870, "car");
  car.playerId = playerId;
  car.setScale(0.4);
  car.body.setAllowGravity(false);
  car.setVelocityX(900);
  car.anims.play("car");
}

function fireArrows(playerId) {
  for (var i = 0; i <= 12; i++) {
    (function (index) {
      setTimeout(function () {
        console.log("ARROW FIRED BY " + playerId);

        if (index % 3 === 0) {
          var newArrow = arrows.create(-100, 200, "arrow_weapon");
          newArrow.setScale(0.25);
          newArrow.setVelocityX(1200);
          newArrow.playerId = playerId;
        } else if (index % 2 === 0) {
          var newArrow = arrows.create(1750, 400, "arrow_weapon");
          newArrow.setScale(0.25);
          newArrow.setFlipX(true);
          newArrow.setVelocityX(-1200);
          newArrow.playerId = playerId;
        } else {
          var newArrow = arrows.create(-100, 855, "arrow_weapon");
          newArrow.setScale(0.25);
          newArrow.setVelocityX(1200);
          newArrow.playerId = playerId;
        }
      }, index * 500);
    })(i);
  }
}
