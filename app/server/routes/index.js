let clima = {'temperatura': '?', 'umidade': '?', 'luminosidade': '?'};
//let status = { 'led1on': 1, 'led2on': 1 }

const status = require('../status');


module.exports = (router) => {
  router.route('/').get((req, res) => {
      res.send('Hello world, Samueldasdadas! ');
  });

  router.route('/status').get((req, res) => {
      res.status(200).send(status.get());
  });

  router.route('/status').post((req, res) => {
      console.log(req.body);

      status.set(req.body);

      res.status(200).send(status);
  });

  router.route('/clima').get((req, res) => {
      //res.status(200).send({'temperatura': '50', 'umidade': '60', 'luminosidade': '70'});
      res.status(200).send(clima);
  });

  router.route('/clima').post((req, res) => {
      console.log(req.body);

      clima = req.body;

      //res.status(200).send({'temperatura': '50', 'umidade': '60', 'luminosidade': '70'});
      res.status(200).send(clima);
  });
}
