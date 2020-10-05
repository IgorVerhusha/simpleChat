const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('./build'));


let port = process.env.PORT ||  8000;


app.use(express.json());
app.use(express.urlencoded({extended: true}))


const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const {id: roomId} = req.params;
  console.log(roomId)
  const obj = rooms.has(roomId) ? {
    users: [...rooms.get(roomId).get('users').values()],
    messages: [...rooms.get(roomId).get('messages').values()]
  } : {users: [], messages: []};
  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send();
});


io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
  });
  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text, date
  }) => {
    const message = {
      userName,
      text,
      date
    };
    rooms.get(roomId).get('messages').push(message);
    socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', message);
  });
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)){
        const users = [...value.get('users').values()];
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
      }
    })
  })
  console.log('socket connected', socket.id);
});



server.listen(port, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('the server has started');
});
