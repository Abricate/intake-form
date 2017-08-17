import { ContactInfo, Job, Order, User } from '../../db';
import { mustBeAdmin } from './';
import { badRequest } from '../../error';
import zipcodes from 'zipcodes';

const router = require('express-promise-router')();

router.use(mustBeAdmin);

router.get('/:jobId/svg', async function (req, res, next) {
  if(!req.params.jobId) {
    return next(badRequest('Specify job IDs'));
  }
  const jobs = await Job.findById(parseInt(req.params.jobId), {
    include: [ BoxFile ]
  });
  
  
  res.send({ jobs: jobs.map(jobToJson) });
});
