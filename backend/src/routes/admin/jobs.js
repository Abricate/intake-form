import { Job } from '../../db';
import { mustBeAdmin } from './';

const router = require('express-promise-router')();

router.use(mustBeAdmin);

router.get('/ready-to-invoice', async function (req, res) {
  const jobs = await Job.findAll({ where: { state: 'ready_to_invoice' }});
  res.send({ jobs });
});

router.get('/paid', async function (req, res) {
  const jobs = await Job.findAll({ where: { paid: true } });

  res.send({ jobs });
});

module.exports = router;
