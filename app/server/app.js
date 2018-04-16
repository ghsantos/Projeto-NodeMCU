const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes')

const app = express();
const router = express.Router();

let port = 5000 || process.env.PORT;

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

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
