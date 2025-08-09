import express from 'express';
import cors from 'cors';
import customerRoute from './routes/customer.js';
import providerRoute from './routes/provider.js';
import chatRoute from './routes/chat.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use('/customer', customerRoute);
app.use('/provider', providerRoute);
app.use('/chat',chatRoute );

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('sendMessage', ({message }) => {
    console.log(message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
