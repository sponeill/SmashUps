var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1600,
  height: 1000,
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 400 },
    },
  },
  scene: { preload, create, update },
};

var game = new Phaser.Game(config);

var player;
var platforms;
var facingRight = true;
var healthZero;
var healthOne;
var healthTwo;
var healthThree;
var healthFour;
var livesThree;
var livesTwo;
var livesOne;
var livesZero;
var lives = 3;
var waitingForRespawn = false;
var rocket;
var invisibleBarriers;
var explosionCollider;
var cars;
var carCollider;
var arrows;

function preload() {
  //Images
  this.load.image("dry_erase_board", "/static/assets/images/DryEraseBoard.png");

  this.load.image("sticky_note", "/static/assets/images/PaulWasHere.png");
  this.load.image("sticky_note_2", "/static/assets/images/WhosHosting.png");
  this.load.image("sticky_note_3", "/static/assets/images/StickyNote3.png");
  this.load.image("sticky_note_4", "/static/assets/images/AS400s.png");

  this.load.image("lives_3", "/static/assets/images/Lives_3.png");
  this.load.image("lives_2", "/static/assets/images/Lives_2.png");
  this.load.image("lives_1", "/static/assets/images/Lives_1.png");
  this.load.image("lives_0", "/static/assets/images/Lives_0.png");

  this.load.image("health_0", "/static/assets/images/Health_0.png");
  this.load.image("health_1", "/static/assets/images/Health_1.png");
  this.load.image("health_2", "/static/assets/images/Health_2.png");
  this.load.image("health_3", "/static/assets/images/Health_3.png");
  this.load.image("health_4", "/static/assets/images/Health_4.png");

  this.load.image("bullet", "/static/assets/images/Bullet.png");
  this.load.image("arrow_weapon", "/static/assets/images/Arrow_Weapon.png");
  this.load.image("arrow", "/static/assets/images/Arrow.png");

  //Text Graphics
  this.load.image("title", "/static/assets/text/Title.png");

  //Set Pieces
  this.load.image("rectangle", "/static/assets/setPieces/Rectangle.png");

  //Sprites

  //Character 1
  this.load.spritesheet("char1_run", "/static/assets/sprites/Characters/1/Run.png", {
    frameWidth: 459,
    frameHeight: 476,
  });

  this.load.spritesheet("char1_idle", "/static/assets/sprites/Characters/1/Idle.png", {
    frameWidth: 459,
    frameHeight: 456,
  });

  this.load.spritesheet("char1_jump", "/static/assets/sprites/Characters/1/Jump_Static.png", {
    frameWidth: 459,
    frameHeight: 486,
  });

  this.load.spritesheet("char1_run_shoot", "/static/assets/sprites/Characters/1/Run_Shoot.png", {
    frameWidth: 459,
    frameHeight: 476,
  });

  this.load.spritesheet("char1_idle_shoot", "/static/assets/sprites/Characters/1/Idle_Shoot.png", {
    frameWidth: 459,
    frameHeight: 456,
  });

  this.load.spritesheet("char1_jump_shoot", "/static/assets/sprites/Characters/1/Jump_Static_Shoot.png", {
    frameWidth: 459,
    frameHeight: 486,
  });

  this.load.spritesheet("char1_dead", "/static/assets/sprites/Characters/1/Dead.png", {
    frameWidth: 535,
    frameHeight: 460,
  });

  //Character 2
  this.load.spritesheet("char2_run", "/static/assets/sprites/Characters/2/Run.png", {
    frameWidth: 459,
    frameHeight: 518,
  });

  this.load.spritesheet("char2_idle", "/static/assets/sprites/Characters/2/Idle.png", {
    frameWidth: 459,
    frameHeight: 492,
  });

  this.load.spritesheet("char2_jump", "/static/assets/sprites/Characters/2/Jump_Static.png", {
    frameWidth: 459,
    frameHeight: 484,
  });

  this.load.spritesheet("char2_run_shoot", "/static/assets/sprites/Characters/2/Run_Shoot.png", {
    frameWidth: 459,
    frameHeight: 518,
  });

  this.load.spritesheet("char2_idle_shoot", "/static/assets/sprites/Characters/2/Idle_Shoot.png", {
    frameWidth: 459,
    frameHeight: 492,
  });

  this.load.spritesheet("char2_jump_shoot", "/static/assets/sprites/Characters/2/Jump_Static_Shoot.png", {
    frameWidth: 459,
    frameHeight: 484,
  });

  this.load.spritesheet("char2_dead", "/static/assets/sprites/Characters/2/Dead.png", {
    frameWidth: 579,
    frameHeight: 500,
  });

  //Effects
  this.load.spritesheet("rocket", "/static/assets/sprites/Effects/Rocket.png", {
    frameWidth: 100,
    frameHeight: 270,
  });

  this.load.spritesheet("car", "/static/assets/sprites/Effects/Car.png", {
    frameWidth: 858,
    frameHeight: 442,
  });

  this.load.spritesheet("explosion", "/static/assets/sprites/Effects/Explosion.png", {
    frameWidth: 671,
    frameHeight: 443,
  });
}

function create() {
  //Images
  this.add.image(800, 500, "dry_erase_board");

  var stickyNote = this.add.image(85, 60, "sticky_note");
  stickyNote.setDisplaySize(105, 95);
  stickyNote.setRotation(-0.2);
  stickyNote.setDepth(1000);

  var stickyNote2 = this.add.image(215, 70, "sticky_note_2");
  stickyNote2.setDisplaySize(105, 105);
  stickyNote2.setRotation(0.2);
  stickyNote2.setDepth(1000);

  livesZero = this.add.image(1535, 70, "lives_0");
  livesZero.setDisplaySize(105, 105);
  livesZero.setRotation(0);
  livesZero.setDepth(1000);

  livesOne = this.add.image(1535, 70, "lives_1");
  livesOne.setDisplaySize(105, 105);
  livesOne.setRotation(0);
  livesOne.setDepth(1000);

  livesTwo = this.add.image(1535, 70, "lives_2");
  livesTwo.setDisplaySize(105, 105);
  livesTwo.setRotation(0);
  livesTwo.setDepth(1000);

  livesThree = this.add.image(1535, 70, "lives_3");
  livesThree.setDisplaySize(105, 105);
  livesThree.setRotation(0);
  livesThree.setDepth(1000);

  var stickyNote4 = this.add.image(1400, 60, "sticky_note_4");
  stickyNote4.setDisplaySize(105, 105);
  stickyNote4.setRotation(0.15);
  stickyNote4.setDepth(1000);

  healthZero = this.add.image(200, 150, "health_0");
  healthZero.setScale(0.45);

  healthOne = this.add.image(200, 150, "health_1");
  healthOne.setScale(0.45);

  healthTwo = this.add.image(200, 150, "health_2");
  healthTwo.setScale(0.45);

  healthThree = this.add.image(200, 150, "health_3");
  healthThree.setScale(0.45);

  healthFour = this.add.image(200, 150, "health_4");
  healthFour.setScale(0.45);

  //Text
  var title = this.add.image(800, 90, "title");
  title.setScale(0.75);

  //Set Pieces
  platforms = this.physics.add.staticGroup();
  platforms.create(800, 750, "rectangle");
  platforms.create(800, 300, "rectangle");
  platforms.create(1200, 510, "rectangle");
  platforms.create(400, 510, "rectangle");

  var arrow = this.physics.add.image(1450, 650, "arrow");
  arrow.body.setAllowGravity(false);
  arrow.setScale(0.75);

  invisibleBarriers = this.physics.add.staticGroup();
  invisibleBarriers.create(800, 750, "barrier", null, false, true);

  rocket = this.physics.add.group();

  //Game
  const self = this;
  this.socket = io();
  this.physics.world.fixedStep = false;

  //This was suggested to prevent sprite stuttering
  //this.physics.world.fixedStep = false;

  this.triggerMovementTimer = this.time.addEvent({
    callback: function () {
      timerEvent(self, self.player);
    },
    callbackScope: this,
    delay: 25,
    loop: true,
  });

  this.playerCollider = this.physics.add.group({ collideWorldBounds: true });
  this.otherPlayers = this.physics.add.group({ collideWorldBounds: true });
  this.explosions = this.physics.add.group({ allowGravity: false });
  cars = this.physics.add.group({ allowGravity: false });
  this.bullets = this.physics.add.group({
    collideWorldBounds: true,
    allowGravity: false,
  });
  arrows = this.physics.add.group({ colliderWorldBounds: true, allowGravity: false });
  this.otherPlayerBullets = this.physics.add.group({
    collideWorldBounds: true,
    allowGravity: false,
  });

  this.physics.world.setBounds(39, 25, 1526, 925, true, true, true, true);
  this.physics.add.collider(this.playerCollider, platforms);
  this.physics.add.collider(this.otherPlayers, platforms);
  this.physics.add.collider(
    rocket,
    invisibleBarriers,
    function (obj1) {
      rocketExplosion(this, this.explosions, obj1);
    },
    null,
    this
  );
  this.physics.add.overlap(
    this.playerCollider,
    arrow,
    function () {
      arrowUp(self);
    },
    null,
    this
  );
  this.physics.add.overlap(
    this.playerCollider,
    this.otherPlayerBullets,
    function (obj1, obj2) {
      playerHit(self, obj1, obj2);
    },
    null,
    this
  );
  this.physics.add.overlap(
    this.playerCollider,
    arrows,
    function (obj1, obj2) {
      hitByArrow(this.player, obj2);
    },
    null,
    this
  );
  this.physics.add.overlap(
    this.otherPlayers,
    this.bullets,
    function (obj1, obj2) {
      otherPlayerHit(self, obj1, obj2);
    },
    null,
    this
  );
  explosionCollider = this.physics.add.overlap(
    this.playerCollider,
    this.explosions,
    function (obj1, obj2) {
      explosionOverlap(this.player, obj2);
    },
    null,
    this
  );
  carCollider = this.physics.add.overlap(
    this.playerCollider,
    cars,
    function (obj1, obj2) {
      carOverlap(this.player, obj2);
    },
    null,
    this
  );

  //Enable Keyboard Inputs
  cursors = this.input.keyboard.createCursorKeys();

  //LOG PLAYER OBJECT FOR TESTING
  this.input.keyboard.on("keydown-P", function () {
    console.log(self.player);
  });

  //SPACEBAR SHOOT
  this.input.keyboard.on("keydown-SPACE", function () {
    shoot(self, self.player);
    self.socket.emit("playerMovement", player.oldPosition);
  });

  //TODO: TRIGGER WITH TOKEN
  this.input.keyboard.on("keydown-R", function () {
    self.socket.emit("rocketTriggered", self.player.playerId);
    rocketLaunch(self.player.playerId);
  });

  //TODO: TRIGGER WITH TOKEN
  this.input.keyboard.on("keydown-C", function () {
    self.socket.emit("carTriggered", self.player.playerId);
    driveBy(self.player.playerId);
  });

  //TODO: TRIGGER WITH TOKEN
  this.input.keyboard.on("keydown-A", function () {
    self.socket.emit("arrowsTriggered", self.player.playerId);
    fireArrows(self.player.playerId);
  });

  //Create Animations

  //Character 1
  this.anims.create({
    key: "char1_run",
    frames: this.anims.generateFrameNumbers("char1_run"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char1_jump",
    frames: this.anims.generateFrameNumbers("char1_jump"),
    frameRate: 25,
    repeat: 0,
  });

  this.anims.create({
    key: "char1_idle",
    frames: this.anims.generateFrameNumbers("char1_idle"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char1_run_shoot",
    frames: this.anims.generateFrameNumbers("char1_run_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char1_idle_shoot",
    frames: this.anims.generateFrameNumbers("char1_idle_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char1_jump_shoot",
    frames: this.anims.generateFrameNumbers("char1_jump_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char1_dead",
    frames: this.anims.generateFrameNumbers("char1_dead"),
    frameRate: 14,
    repeat: 0,
  });

  //Character 2
  this.anims.create({
    key: "char2_run",
    frames: this.anims.generateFrameNumbers("char2_run"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_jump",
    frames: this.anims.generateFrameNumbers("char2_jump"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_idle",
    frames: this.anims.generateFrameNumbers("char2_idle"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_run_shoot",
    frames: this.anims.generateFrameNumbers("char2_run_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_idle_shoot",
    frames: this.anims.generateFrameNumbers("char2_idle_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_jump_shoot",
    frames: this.anims.generateFrameNumbers("char2_jump_shoot"),
    frameRate: 25,
    repeat: -1,
  });

  this.anims.create({
    key: "char2_dead",
    frames: this.anims.generateFrameNumbers("char2_dead"),
    frameRate: 14,
    repeat: 0,
  });

  //Effects
  this.anims.create({
    key: "rocket",
    frames: this.anims.generateFrameNumbers("rocket"),
    frameRate: 20,
    repeat: -1,
  });

  this.anims.create({
    key: "car",
    frames: this.anims.generateFrameNumbers("car"),
    frameRate: 60,
    repeat: -1,
  });

  this.anims.create({
    key: "explosion",
    frames: this.anims.generateFrameNumbers("explosion"),
    frameRate: 14,
    repeat: 0,
  });

  //-----------------------------------------------------------------------//

  //Socket Events

  this.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on("addBullet", function (bulletData) {
    const newBullet = self.otherPlayerBullets.create(bulletData.x, bulletData.y, "bullet");

    newBullet.setDisplaySize(20, 10);
    newBullet.playerId = bulletData.playerId;
    newBullet.id = bulletData.Id;
    newBullet.body.onWorldBounds = true;

    if (bulletData.facingRight) {
      newBullet.setVelocityX(1000);
    } else {
      newBullet.setVelocityX(-1000);
    }
  });

  this.socket.on("playerDisconnected", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  //Launch Rocket initiated by another Player
  this.socket.on("rocketLaunch", function (playerId) {
    rocketLaunch(playerId);
  });

  //Start Car initiated by another Player
  this.socket.on("carStart", function (playerId) {
    driveBy(playerId);
  });

  //Start Car initiated by another Player
  this.socket.on("fireArrows", function (playerId) {
    fireArrows(playerId);
  });

  //Handle Other Player Movements
  this.socket.on("playerMoved", function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        //TODO: IF IsShooting, move to front of movements stack?

        //Add movement record to player movement queue
        otherPlayer.movements.push(playerInfo);

        if (otherPlayer.movements.length > 8) {
          let movementInfo = otherPlayer.movements.shift();

          if (movementInfo.waitingForRespawn && otherPlayer.waitingForRespawn) {
            //Don't do anything until the player has respawned
            return;
          }

          otherPlayer.waitingForRespawn = movementInfo.waitingForRespawn;

          self.tweens.add({
            targets: otherPlayer,
            x: otherPlayer.x + (movementInfo.x - otherPlayer.x) * 0.5,
            y: otherPlayer.y + (movementInfo.y - otherPlayer.y) * 0.5,
            duration: 25,
            ease: "Linear",
            yoyo: false,
            repeat: 0,
          });

          if (movementInfo.waitingForRespawn) {
            otherPlayer.anims.play("char2_dead", false);
          } else {
            if (movementInfo.direction === "right") {
              otherPlayer.setFlipX(false);

              if (movementInfo.isShooting) {
                otherPlayer.anims.play("char2_run_shoot", true);
              } else {
                otherPlayer.anims.play("char2_run", true);
              }
            }

            if (movementInfo.direction === "left") {
              otherPlayer.setFlipX(true);

              if (movementInfo.isShooting) {
                otherPlayer.anims.play("char2_run_shoot", true);
              } else {
                otherPlayer.anims.play("char2_run", true);
              }
            }

            if (movementInfo.direction === "idle") {
              if (playerInfo.facingRight !== true) {
                otherPlayer.setFlipX(true);
              } else {
                otherPlayer.setFlipX(false);
              }

              if (movementInfo.isShooting) {
                otherPlayer.anims.play("char2_idle_shoot", true);
              } else {
                otherPlayer.anims.play("char2_idle", true);
              }
            }

            if (movementInfo.direction === "up") {
              if (movementInfo.facingRight !== true) {
                otherPlayer.setFlipX(true);
              } else {
                otherPlayer.setFlipX(false);
              }

              if (movementInfo.isShooting) {
                otherPlayer.anims.play("char2_jump_shoot", true);
              } else {
                otherPlayer.anims.play("char2_jump", true);
              }
            }
          }
        }
      }
    });
  });
}

function timerEvent(self, player) {
  if (player) {
    self.socket.emit("playerMovement", player.oldPosition);
  }
}

function rocketExplosion(self, explosions, rocket) {
  rocket.destroy();
  var explosion = explosions.create(875, 450, "explosion");
  explosion.setScale(1.5);
  explosion.playerId = rocket.playerId;
  explosion.anims.play("explosion", false);

  self.tweens.add({
    targets: explosion,
    alpha: { from: 1, to: 0.0 },
    ease: "Sine.InOut",
    duration: 2000,
    repeat: 0,
    yoyo: false,
  });

  setTimeout(() => {
    explosion.destroy();
  }, "2000");
}

function update() {
  //Remove Spent Bullets
  this.bullets.children.iterate((bullet) => {
    if (bullet != null) {
      if (bullet.body.blocked.right || bullet.body.blocked.left) {
        bullet.destroy();
      }
    }
  });

  this.otherPlayerBullets.children.iterate((bullet) => {
    if (bullet != null) {
      if (bullet.body.blocked.right || bullet.body.blocked.left) {
        bullet.destroy();
      }
    }
  });

  //Player Movement
  if (this.player) {
    if (!waitingForRespawn) {
      var direction;

      //TODO: ONLY PLAY FIRE ANIMATION ONCE DURING SPACE BAR HOLD DOWN. LISTENER EVENT FOR SPACEBAR KEYUP?

      //Move Left
      if (cursors.left.isDown) {
        direction = "left";
        facingRight = false;
        this.player.setVelocityX(-200);
        this.player.setFlipX(true);

        if (cursors.space.isDown) {
          this.player.anims.play("char1_run_shoot", true);
        } else {
          this.player.anims.play("char1_run", true);
        }
      } else if (cursors.right.isDown) {
        direction = "right";
        facingRight = true;
        this.player.setFlipX(false);
        this.player.setVelocityX(200);

        if (cursors.space.isDown) {
          this.player.anims.play("char1_run_shoot", true);
        } else {
          this.player.anims.play("char1_run", true);
        }
        //Idle
      } else {
        direction = "idle";
        if (cursors.space.isDown) {
          this.player.anims.play("char1_idle_shoot", true);
        } else {
          this.player.anims.play("char1_idle", true);
        }
        this.player.setVelocityX(0);
      }

      //Jump
      if (cursors.up.isDown) {
        direction = "up";
        if (!facingRight) {
          this.player.setFlipX(true);
        }

        if (this.player.body.blocked.down) {
          this.player.setVelocityY(-480);
        }

        if (cursors.space.isDown) {
          //TODO: THIS ISN'T PLAYING THE FULL ANIMATION
          this.player.anims.play("char1_jump_shoot", true);
        } else {
          this.player.anims.play("char1_jump", true);
        }
      }
    }

    //Get Player Location and Send it to Everyone Else
    const currPosition = {
      x: this.player.x,
      y: this.player.y,
      direction: direction,
      facingRight: facingRight,
      isShooting: cursors.space.isDown,
      waitingForRespawn: waitingForRespawn,
    };

    if (
      this.player.oldPosition &&
      (currPosition.x !== this.player.oldPosition.x ||
        currPosition.y !== this.player.oldPosition.y ||
        currPosition.direction !== this.player.oldPosition.direction ||
        currPosition.direction !== this.player.oldPosition.direction ||
        currPosition.facingRight !== this.player.oldPosition.facingRight ||
        currPosition.isShooting !== this.player.oldPosition.isShooting ||
        currPosition.waitingForRespawn !== this.player.oldPosition.waitingForRespawn)
    ) {
      //Update the Player location via Socket 20 Times per Second
      // if (elapsedTime % 50 == 0) {
      //   this.socket.emit("playerMovement", currPosition);
      // }
    }

    this.player.oldPosition = currPosition;
  }
}
