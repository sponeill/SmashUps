function hitByArrow(player, arrow) {
  if (arrow.playerId != player.playerId) {
    arrow.destroy();
    die(player);
  }
}

function playerHit(self, player, bullet) {
  bullet.destroy();

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

function countDown(timerText) {
  if (self.gameStarted) {
    self.timerCount = self.timerCount - 1;
    timerText.setText(self.timerCount);
  }
}

function createDocument(documentData) {
  var newDocument;

  if (documentData.isPowerUp == true) {
    newDocument = documents.create(documentData.x, documentData.y, "star_document");
  } else {
    newDocument = documents.create(documentData.x, documentData.y, "document");
  }

  newDocument.setScale(0.1);
  newDocument.isPowerUp = documentData.isPowerUp;
  newDocument.powerUp = document.powerUp;
  newDocument.id = documentData.id;
}

function documentCollected(self, player, document, docCountLabel) {
  self.socket.emit("documentCollected", document.id);
  document.destroy();

  player.documentCount++;

  docCountLabel.setText(player.documentCount);
  console.log("isPowerUp:" + document.isPowerUp);

  if (document.isPowerUp) {
    console.log("isPowerUp:" + document.isPowerUp);
    console.log(document.powerUp);
    if (document.powerUp == "rocket") {
      rocketLaunch(player.playerId);
      self.socket.emit("rocketTriggered", player.playerId);
    } else if (document.powerUp == "car") {
      driveBy(player.playerId);
      self.socket.emit("carTriggered", player.playerId);
    } else if (document.powerUp == "arrows") {
      fireArrows(player.playerId);
      self.socket.emit("arrowsTriggered", player.playerId);
    }
  }
}

function destroyDocument(id, documents) {
  var document = documents.children.entries.find((entry) => entry.id === id);
  if (document != null) {
    document.destroy();
  }
}

function spawnDocument(self, documents) {
  if (documents.children.entries.length > 3 || gameStarted == false) {
    return;
  }

  let isPowerUp = false;
  let powerUp = "";

  const randomValue = Math.random();

  // There is a 33% chance that the document will be a powerup
  if (randomValue < 0.33) {
    isPowerUp = true;

    var powerUpValue = Math.random();

    if (powerUpValue <= 0.33) {
      powerUp = "rocket";
    } else if (powerUpValue > 0.33 && powerUpValue <= 0.66) {
      powerUp = "car";
    } else {
      powerUp = "arrows";
    }
  }

  var newDocument;

  if (isPowerUp) {
    newDocument = documents.create(0, 0, "star_document");
  } else {
    newDocument = documents.create(0, 0, "document");
  }

  newDocument.setRandomPosition(100, 100, 1300, 800);
  newDocument.setScale(0.1);
  newDocument.isPowerUp = isPowerUp;
  newDocument.powerUp = powerUp;
  newDocument.id = generateRandomId();

  var dataToSend = {
    x: newDocument.x,
    y: newDocument.y,
    id: newDocument.id,
    isPowerUp: newDocument.isPowerUp,
    powerUp: newDocument.powerUp,
  };

  //THIS WILL SPAWN DOCUMENTS ACROSS THE PLAYER BOARDS
  self.socket.emit("documentCreated", dataToSend);
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
