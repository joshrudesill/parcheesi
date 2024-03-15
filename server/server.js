const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
io.listen(4000);
// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route Includes
const userRouter = require("./routes/user.router");
const gameSetupRouter = require("./routes/game-setup.router.js");
const pool = require("./modules/pool.js");

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());
const roomData = {};
// Routes
app.use("/api/user", userRouter);
app.use("/api/game", gameSetupRouter);
io.on("connection", (socket) => {
  console.log("connect");
  socket.on("hello", () => {
    socket.emit("hi", true);
  });
  socket.on("join-game-room", (gameRoom, username) => {
    console.log("join-gameroom");
    socket.gameRoom = gameRoom;
    socket.username = username;

    if (!roomData[gameRoom]) {
      roomData[gameRoom] = [];
    }
    if (!roomData[gameRoom].includes(username)) {
      roomData[gameRoom].push(username);
    }
    socket.join(gameRoom);
    io.to(gameRoom).emit("player-joined", roomData[gameRoom]);
  });
  socket.on("leaving-gameroom", () => {
    console.log("leaving-gameroom");
    if (roomData[socket.gameRoom]) {
      roomData[socket.gameRoom] = roomData[socket.gameRoom].filter(
        (i) => i !== socket.username
      );
      socket.leave(socket.gameRoom);
      delete socket.gameRoom;
      delete socket.username;
      io.to(socket.gameRoom).emit(
        "leaving-gameroom",
        roomData[socket.gameRoom]
      );
    }
  });
  socket.on("disconnect", async () => {
    console.log("DC");
    console.log(roomData);
    if (roomData[socket.gameRoom]) {
      console.log("1");
      if (roomData[socket.gameRoom].started) {
        console.log("2");
        // Player left while in game, need to end whole game
        await pool.query(
          `UPDATE "user" SET current_game = null WHERE current_game = $1;`,
          [socket.gameRoom]
        );
        io.to(socket.gameRoom).emit("gameover", "player-left");
        delete roomData[socket.gameRoom];
        delete socket.gameRoom;
        delete socket.username;
      } else {
        roomData[socket.gameRoom] = roomData[socket.gameRoom].filter(
          (i) => i !== socket.username
        );
        delete socket.gameRoom;
        delete socket.username;
        io.to(socket.gameRoom).emit(
          "leaving-gameroom",
          roomData[socket.gameRoom]
        );
      }
    }
  });
  socket.on("leaving-startedgame", async () => {
    console.log("leaving-started");
    if (roomData[socket.gameRoom]) {
      // end game in sql
      await pool.query(
        `UPDATE "user" SET current_game = null WHERE current_game = $1;`,
        [socket.gameRoom]
      );
      console.log(roomData);
      delete roomData[socket.gameRoom];
      delete socket.gameRoom;
      delete socket.username;
      io.to(socket.gameRoom).emit("gameover", "player-left");
    }
  });
  socket.on("notify-game-start", async () => {
    if (roomData[socket.gameRoom]) {
      roomData[socket.gameRoom].started = true;
      io.to(socket.gameRoom).emit("game-start");
    }
  });
  socket.on("next-turn", async (newGS, turn) => {
    console.log("next-turn:", socket.gameRoom);
    if (roomData[socket.gameRoom]) {
      await pool.query(
        "UPDATE game_state SET piece_positions = $1, turn = $3 WHERE game_code = $2;",
        [newGS, socket.gameRoom, turn + 1]
      );
      io.to(socket.gameRoom).emit("advance-turn", socket.gameRoom);
    }
  });
});

// Listen Server & Port
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
