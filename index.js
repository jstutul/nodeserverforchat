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

const io = require("socket.io")(8000, {
  cors: {
    origin: "*"
  }
});

const users={}

io.on('connection', (socket) => {
    socket.on('new-user-join', (name) => {
      users[socket.id]=name;
      socket.broadcast.emit('user-join',name);
    });
    socket.on('send', (message) => {
        socket.broadcast.emit('receive',{message:message,name: users[socket.id]});
      });
    socket.on('speaking', (spk) => {
        socket.broadcast.emit('speak',{spk:spk,name: users[socket.id]});
      });
      socket.on('disconnect', (message) => {
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id]
      });
  });
