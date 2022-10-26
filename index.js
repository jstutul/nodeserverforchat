// const express=require('express');
// const app=express();
// const http=require('http');
// const server=http.createServer(app)
// const {Server}=require('socket.io')
// const io=new Server(server);

// const cors = require('cors');
// io.use(cors({
//     origin: '8000'
// }));

// const io=require('socket.io')(8000,{
//   origins: ["*"]
// })

// const io = require("socket.io")(process.env.PORT||8000, {
//   cors: {
//     origin: "*"
//   }
// });

const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || process.env.API_PORT;
const app = express();
app.use(express.json());
app.use(cors());
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
