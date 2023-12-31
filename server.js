const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;
var server = http.Server(app);
var io = socketIO(server, {
  pingTimeout: 60000,
});

//app.set("port", 5000);
app.use("/static", express.static(__dirname + "/static"));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(PORT, function () {
  console.log("Starting server on port " + PORT);
});

var players = {};

io.on("connection", function (socket) {
  console.log("player [" + socket.id + "] connected");

  players[socket.id] = {
    x: 30,
    y: 30,
    playerId: socket.id,
    color: getRandomColor(),
    movements: [],
  };
  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("disconnect", function () {
    console.log("player [" + socket.id + "] disconnected");
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });

  socket.on("playerMovement", function (movementData) {
    if (movementData) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      players[socket.id].direction = movementData.direction;
      players[socket.id].facingRight = movementData.facingRight;
      players[socket.id].isShooting = movementData.isShooting;
      players[socket.id].waitingForRespawn = movementData.waitingForRespawn;

      socket.broadcast.emit("playerMoved", players[socket.id]);
    }
  });

  socket.on("bulletCreated", function (bulletData) {
    socket.broadcast.emit("addBullet", bulletData);
  });

  socket.on("rocketTriggered", function (playerId) {
    socket.broadcast.emit("rocketLaunch", playerId);
  });

  socket.on("carTriggered", function (playerId) {
    socket.broadcast.emit("carStart", playerId);
  });

  socket.on("arrowsTriggered", function (playerId) {
    socket.broadcast.emit("fireArrows", playerId);
  });
});

function getRandomColor() {
  return "0x" + Math.floor(Math.random() * 16777215).toString(16);
}
