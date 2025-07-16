const express = require('express');
const http = require('http');
const {Server} = require('socket.io'); 
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

mongoose.connect('mongodb+srv://adarshjayasankerdev:talkbit@cluster0.xrfrm9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error: ', err))


const users = {};
const userSockets = {};

io.on('connection', (socket) => {
  console.log('New user connected', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    userSockets[username] = socket.id;
    io.emit('online-users', Object.values(users));
    console.log(`${username} joined`);
  });

  socket.on('start-chat', async ({from, to}) => {
    const roomId = [from, to].sort().join('_');
    socket.join(roomId);
    const messages = await Message.find({room: roomId});
    socket.emit('chat-history', messages);
  });

  socket.on('private-message', async({from, to, content}) => {
    const roomId = [from, to].sort().join('_');
    const newMsg = new Message({
      room: roomId,
      sender: from,
      receiver: to,
      content
    });
    await newMsg.save();

    io.to(roomId).emit('chat-message', {
      from, 
      to,
      content,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    delete(userSockets[username]);
    io.emit('online-users', Object.values(userSockets));
  })

});


server.listen(3001, () => {
  console.log('Server started on Port 3001.');
})