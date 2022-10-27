

const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors({
  origin: '*'
}));

const server = http.createServer(app);
const users = {};
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("new-user-join", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-join", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("speaking", (spk) => {
    socket.broadcast.emit("speak", { spk: spk, name: users[socket.id] });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server running");
});
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
