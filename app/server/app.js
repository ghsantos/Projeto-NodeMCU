const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes')

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
//res.header("Access-Control-Allow-Origin", "*");
//app.use('/static',express.static(path.join(__dirname,'static')))

app.use('/api', router);

io.on('connection', socket => {
  console.log("New client connected");

  setInterval(
    () => getApiAndEmit(socket),
    5000
  );

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
