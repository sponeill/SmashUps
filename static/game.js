var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1600,
  height: 1000,
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 400 }
    }
  },
  scene: { preload, create, update }
}

var game = new Phaser.Game(config)

var player;
var facingRight = true;

function preload() {
  //Images
  this.load.image("dry_erase_board", "/static/assets/images/DryEraseBoard.png");
  this.load.image("sticky_note", "/static/assets/images/StickyNote.png");
  this.load.image("sticky_note_2", "/static/assets/images/StickyNote2.png");
  this.load.image("sticky_note_3", "/static/assets/images/StickyNote3.png");

  //Sprites

  //Character 1
    this.load.spritesheet('char1_run', '/static/assets/sprites/Characters/1/Run.png', {
      frameWidth: 459,
      frameHeight: 476,
     });
  
    this.load.spritesheet('char1_idle', '/static/assets/sprites/Characters/1/Idle.png', {
      frameWidth: 459,
      frameHeight: 456,
    });
  
    this.load.spritesheet('char1_jump', '/static/assets/sprites/Characters/1/Jump_Static.png', {
      frameWidth: 459,
      frameHeight: 486,
    });
  
    this.load.spritesheet('char1_run_shoot', '/static/assets/sprites/Characters/1/Run_Shoot.png', {
      frameWidth: 459,
      frameHeight: 476,
    });
  
    this.load.spritesheet('char1_idle_shoot', '/static/assets/sprites/Characters/1/Idle_Shoot.png', {
      frameWidth: 459,
      frameHeight: 456,
    });
  
    this.load.spritesheet('char1_jump_shoot', '/static/assets/sprites/Characters/1/Jump_Static_Shoot.png', {
      frameWidth: 459,
      frameHeight: 486,
    });

  //Character 2
    this.load.spritesheet('char2_run', '/static/assets/sprites/Characters/2/Run.png', {
      frameWidth: 459,
      frameHeight: 518,
    });

    this.load.spritesheet('char2_jump', '/static/assets/sprites/Characters/2/Jump.png', {
      frameWidth: 459,
      frameHeight: 513,
    });
  
    this.load.spritesheet('char2_idle', '/static/assets/sprites/Characters/2/Idle.png', {
      frameWidth: 459,
      frameHeight: 492,
    });
  
    this.load.spritesheet('char2_idle_shoot', '/static/assets/sprites/Characters/2/Idle_Shoot.png', {
      frameWidth: 459,
      frameHeight: 492,
    });
}

function create() {
  this.add.image(800, 500, "dry_erase_board");

  var stickyNote = this.add.image(85, 70, "sticky_note");
  stickyNote.setDisplaySize(105, 95);
  stickyNote.setRotation(-0.2)

  var stickyNote2 = this.add.image(285, 70, "sticky_note_2");
  stickyNote2.setDisplaySize(105, 105);
  stickyNote2.setRotation(.2)

  var stickyNote3 = this.add.image(1535, 70, "sticky_note_3");
  stickyNote3.setDisplaySize(105, 105);
  stickyNote3.setRotation(0)

  //x=39, y = 25, height = 950-35, width = 1565 - 39
  this.physics.world.setBounds(39, 25, 1526, 920, true, true, true, true);

  const self = this
  this.socket = io()
  this.otherPlayers = this.physics.add.group({ collideWorldBounds: true })

  //Enable Keyboard Inputs
  cursors = this.input.keyboard.createCursorKeys();

  //LOG PLAYER OBJECT FOR TESTING
  this.input.keyboard.on('keydown-P', function () {
    console.log("PLAYER:");
    console.log(this.player);
  });

  //-----------------------------------------------------------------------//
  
    //Create Player Objects

    //NOTE: THIS IS HANDLED IN THE ADDPLAYER AND ADDOTHERPLAYERS FUNCTIONS

  //-----------------------------------------------------------------------//
  
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
      key: "char2_idle_shoot",
      frames: this.anims.generateFrameNumbers("char2_idle_shoot"),
      frameRate: 25,
      repeat: -1,
    });

  //-----------------------------------------------------------------------//

  //Socket Events

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id])
      } else {
        addOtherPlayers(self, players[id])
      }
    })
  })

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo)
  })

  this.socket.on('playerDisconnected', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy()
      }
    })
  })

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        
        otherPlayer.setPosition(playerInfo.x, playerInfo.y)

        //TODO: ANIMATIONS FOR playerInfo.isShooting == true

        if (playerInfo.direction === "right") {
          otherPlayer.setFlipX(false);
          otherPlayer.anims.play("char2_run", true);
        }

        if (playerInfo.direction === "left") {
          otherPlayer.setFlipX(true);
          otherPlayer.anims.play("char2_run", true);
        }

        if (playerInfo.direction === "idle") {
          if (playerInfo.facingRight !== true) {
            otherPlayer.setFlipX(true);
          } else {
            otherPlayer.setFlipX(false);
          }

          if (playerInfo.isShooting) {
            otherPlayer.anims.play("char2_idle_shoot", true);
          } else {
            otherPlayer.anims.play("char2_idle", true);
          }
        }

        if (playerInfo.direction === "up") {
          if (playerInfo.facingRight !== true) {
            otherPlayer.setFlipX(true);
          } else {
            otherPlayer.setFlipX(false);
          }

          otherPlayer.anims.play("char2_jump", true);
        }

        //TODO: Default to Jump animation if player is in the air and also pushing left or right
      }
    })
  })
}

function addPlayer(self, playerInfo) {

  //var username = prompt("Please Enter Your Name", "")

  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'char1_idle')
    .setDisplaySize(125, 125)
    .setBounce(0.1)
    .setCollideWorldBounds(true)
  
  self.player.lives = 5;
  self.player.hitPoints = 3;
  //self.player.username = username;

  //TODO: SOCKET EVENT UPDATE PLAYER OBJECT WITH USERNAME MATCH ON SOCKET ID
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'char2_idle')
    .setDisplaySize(125, 125)
    
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.username = playerInfo.username;
  //otherPlayer.setTint(playerInfo.color)
  self.otherPlayers.add(otherPlayer)
}

function update() {

  //-----------------------------------------------------------------------//
  
  //Player Movement

  if (this.player) {

    var direction;

    //Move Left
    if (cursors.left.isDown) {
      direction = "left";
      facingRight = false;
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);

      if (this.player.body.blocked.down) {
        if (cursors.space.isDown) {
          this.player.anims.play("char1_run_shoot", true);
        } else {
          this.player.anims.play("char1_run", true);
        }
      } else {
        if (cursors.space.isDown) {
          this.player.anims.play("char1_jump_shoot", true);
        } else {
          this.player.anims.play("char1_jump", true);
        }
      }
    //Move Right
    } else if (cursors.right.isDown) {
      direction = "right";
      facingRight = true;
      this.player.setFlipX(false);
      this.player.setVelocityX(200);

      if (this.player.body.blocked.down) {
        if (cursors.space.isDown) {
          this.player.anims.play("char1_run_shoot", true);
        } else {
          this.player.anims.play("char1_run", true);
        }
      } else {
         if (cursors.space.isDown) {
          this.player.anims.play("char1_jump_shoot", true);
        } else {
          this.player.anims.play("char1_jump", true);
        }
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
        this.player.setVelocityY(-380);
      }

      if (cursors.space.isDown) {
        //TODO: THIS ISN'T PLAYING THE FULL ANIMATION
          this.player.anims.play("char1_jump_shoot", true);
      } else {
          this.player.anims.play("char1_jump", true);
      }
    }

    //Get Player Location and Send it to Everyone Else
      const currPosition = {
        x: this.player.x,
        y: this.player.y,
        direction: direction,
        facingRight: facingRight,
        isShooting: cursors.space.isDown,
    }

    if (this.player.oldPosition && (
          currPosition.x !== this.player.oldPosition.x ||
          currPosition.y !== this.player.oldPosition.y ||
          currPosition.direction !== this.player.oldPosition.direction ||
          currPosition.facingRight !== this.player.oldPosition.facingRight ||
          currPosition.isShooting !== this.player.oldPosition.isShooting)) {
      
      //Update the Player location via Socket
      this.socket.emit('playerMovement', currPosition)
    }

    this.player.oldPosition = currPosition
  }
}
