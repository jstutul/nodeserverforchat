const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

app.get('/', (req, res, next) =>
res.send("<h1>Server Running</h1>")
);
io.on('connection', function(socket){
io.emit('message from server', 'message from server - it works!')
})
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
