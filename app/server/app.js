const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes')

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const status = require('./status');
const clima = require('./clima');

const port = 5000 || process.env.PORT;

const router = express.Router();
/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

io.on('connection', socket => {
  status.setEmiter(socket);
  clima.setEmiter(socket);

  console.log("New client connected");

  socket.emit('status', status.get());
  socket.emit('clima', clima.get());

  socket.on('setStatus', data => {
    status.set(data);

    socket.broadcast.emit('status', data);
  });

  socket.on('setClima', data => {
    clima.set(data);

    socket.broadcast.emit('clima', data);
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
  const num = Math.random();
  console.log(num);
  socket.emit("FromAPI", num.toString());
};

/** start server */
server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
