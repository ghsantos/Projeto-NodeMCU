const status = require('../status');
const clima = require('../clima');

module.exports = (router) => {
  router.route('/').get((req, res) => {
      res.send('Hello in to NodeMCU App');
  });

  router.route('/status').get((req, res) => {
      res.status(200).send(status.get());
  });

  router.route('/status').post((req, res) => {
      status.set(req.body);

      res.status(201).send(status.get());
  });

  router.route('/clima').get((req, res) => {
      res.status(200).send(clima.get());
  });

  router.route('/clima').post((req, res) => {
      clima.set(req.body);

      res.status(201).send(clima.get());
  });
}
