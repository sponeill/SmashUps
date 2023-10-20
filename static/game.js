// TODO: REPLACE CAR GAME CODE AND ASSETS WITH SHOOTER GAME

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
      gravity: { y: 300 }
    }
  },
  scene: { preload, create, update }
}

var game = new Phaser.Game(config)

var player;
var facingRight = true;

function preload() {
  this.load.image('car', '/static/assets/car.png')

  //Sprites

  //Character 1
    this.load.spritesheet('char1_run', '/static/assets/sprites/Characters/1/Run.png', {
      frameWidth: 459,
      frameHeight: 584,
     });
  
    this.load.spritesheet('char1_idle', '/static/assets/sprites/Characters/1/Idle.png', {
      frameWidth: 459,
      frameHeight: 584,
    });

  //Character 2
    this.load.spritesheet('char2_run', '/static/assets/sprites/Characters/2/Run.png', {
      frameWidth: 459,
      frameHeight: 584,
    });

    this.load.spritesheet('char2_jump', '/static/assets/sprites/Characters/2/Jump.png', {
      frameWidth: 459,
      frameHeight: 584,
    });
  
    this.load.spritesheet('char2_idle', '/static/assets/sprites/Characters/2/Idle.png', {
      frameWidth: 459,
      frameHeight: 584,
    });
}

function create() {
  const self = this
  this.socket = io()
  this.otherPlayers = this.physics.add.group({ collideWorldBounds: true })

  //Enable Keyboard Inputs
  cursors = this.input.keyboard.createCursorKeys();

  //-----------------------------------------------------------------------//
  
    //Create Player Objects

    //NOTE: THIS IS HANDLED IN THE ADDPLAYER AND ADDOTHERPLAYERS FUNCTIONS

  //-----------------------------------------------------------------------//
  
    //Create Animations

    //Character 1
    this.anims.create({
        key: "char1_run",
        frames: this.anims.generateFrameNumbers("char1_run", {
          start: 0,
          end: 7,
        }),
        frameRate: 25,
        repeat: -1,
    });
  
    this.anims.create({
      key: "char1_idle",
      frames: this.anims.generateFrameNumbers("char1_idle", {
        start: 0,
        end: 9,
      }),
      frameRate: 25,
      repeat: -1,
    });

    //Character 2
    this.anims.create({
      key: "char2_run",
      frames: this.anims.generateFrameNumbers("char2_run", {
        start: 1,
        end: 8,
      }),
      frameRate: 25,
      repeat: -1,
    });

    this.anims.create({
      key: "char2_jump",
      frames: this.anims.generateFrameNumbers("char2_jump", {
        start: 0,
        end: 15,
      }),
      frameRate: 25,
      repeat: -1,
    });
  
    this.anims.create({
      key: "char2_idle",
      frames: this.anims.generateFrameNumbers("char2_idle", {
        start: 0,
        end: 9,
      }),
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

  this.cursors = this.input.keyboard.createCursorKeys()

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation)
        otherPlayer.setPosition(playerInfo.x, playerInfo.y)
      }
    })
  })
}

function addPlayer(self, playerInfo) {
  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'char1_idle')
    .setDisplaySize(125, 125)
    .setBounce(0.2)
    .setCollideWorldBounds(true)
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'char2_idle')
    .setDisplaySize(125, 125)
    
  otherPlayer.playerId = playerInfo.playerId
  otherPlayer.setTint(playerInfo.color)
  self.otherPlayers.add(otherPlayer)
}

function update() {

  //Enemy Movement Anims

  

  //-----------------------------------------------------------------------//
  
  //Player Movement

  if (this.player) {
    if (cursors.left.isDown) {
      facingRight = false;
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);

      if (this.player.body.touching.down) {
        this.player.anims.play("char1_run", true);
      } else {
        this.player.anims.play("char2_jump", true);
      }
    } else if (cursors.right.isDown) {
      facingRight = true;
      this.player.setFlipX(false);
      this.player.setVelocityX(160);

      if (this.player.body.touching.down) {
        this.player.anims.play("char1_run", true);
      } else {
        this.player.anims.play("char2_jump", true);
      }
    } else {
      this.player.anims.play("char1_idle", true);
      this.player.setVelocityX(0);
    }

    //TODO: JUMP DOESN'T WORK

    //Jump
    //Check to see if Up Key is depressed AND if player body is touching solid ground
    // if (cursors.up.isDown && this.player.body.touching.down) {
    //   this.player.setVelocityY(-200);
    //   if (!facingRight) {
    //     this.player.setFlipX(true);
    //   } 
      
    //   this.player.anims.play("char2_jump", true);
    // }

    //Get Player Location and Send it to Everyone Else
    
    const currPosition = {
      x: this.player.x,
      y: this.player.y,
      rotation: this.player.rotation
    }
    if (this.player.oldPosition && (
          currPosition.x !== this.player.oldPosition.x ||
          currPosition.y !== this.player.oldPosition.y ||
      currPosition.rotation !== this.player.oldPosition.rotation)) {
      //Update the Player location
      this.socket.emit('playerMovement', currPosition)
    }

    this.player.oldPosition = currPosition
  }

  //   if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
  //     this.car.setAngularVelocity(-100)
  //   } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
  //     this.car.setAngularVelocity(100)
  //   } else {
  //     this.car.setAngularVelocity(0)
  //   }

  //   const velX = Math.cos((this.car.angle - 360) * 0.01745)
  //   const velY = Math.sin((this.car.angle - 360) * 0.01745)
  //   if (this.cursors.up.isDown) {
  //     this.car.setVelocityX(200 * velX)
  //     this.car.setVelocityY(200 * velY)
  //   } else if (this.cursors.down.isDown) {
  //     this.car.setVelocityX(-100 * velX)
  //     this.car.setVelocityY(-100 * velY)
  //   } else {
  //     this.car.setAcceleration(0)
  //   }

  //   const currPosition = {
  //     x: this.car.x,
  //     y: this.car.y,
  //     rotation: this.car.rotation
  //   }
  //   if (this.car.oldPosition && (
  //         currPosition.x !== this.car.oldPosition.x ||
  //         currPosition.y !== this.car.oldPosition.y ||
  //     currPosition.rotation !== this.car.oldPosition.rotation)) {
  //     //Update the Player location
  //     this.socket.emit('playerMovement', currPosition)
  //   }

  //   this.car.oldPosition = currPosition
  // }
}
