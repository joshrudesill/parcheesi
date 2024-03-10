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

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/user", userRouter);
app.use("/api/game", gameSetupRouter);
io.on("connection", (socket) => {
  console.log("connect");
  socket.on("hello", () => {
    socket.emit("hi", true);
  });
});

// Listen Server & Port
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
