const app = require("express")();
const http = require('http').Server(app);
const io = require('socket.io',{secure: true})(http);
const cors = require('cors');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/');
})

app.use(cors());


const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(3334, () => {
  console.log('server started at port 3334!')
});