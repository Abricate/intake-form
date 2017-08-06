import { ContactInfo, Job, Order, User } from '../../db';
import { mustBeAdmin } from './';
import { badRequest } from '../../error';
import zipcodes from 'zipcodes';

const router = require('express-promise-router')();

router.use(mustBeAdmin);

function contactInfoToJson(contact_info) {
  let city, state;
  if(contact_info.zipcode != null) {
    const result = zipcodes.lookup(contact_info.zipcode);
    if(result) {
      city = result['city'];
      state = result['state'];
    }
  }
  
  return {
    name: contact_info.name,
    address1: contact_info.address1,
    address2: contact_info.address2,
    zipcode: contact_info.zipcode,
    country: contact_info.country,
    city,
    state,
    email: contact_info.email,
    phoneNumber: contact_info.phoneNumber
  }
}

function jobToJson(job) {
  const props = job.propsParsed();
  
  return {
    id: job.id,
    orderIdentifier: job.order.orderIdentifier,
    state: job.state,
    quantity: props.quantity,
    unitPrice: props.unitPrice,
    materialCategory: props._materialCategory,
    material: props.material,
    materialThickness: props.materialThickness,
    comments: props.comments,
    contactInfo: contactInfoToJson(job.order.contact_info),
    createdAt: job.createdAt
  };
}

router.get('/by-id/:jobIds', async function (req, res, next) {
  if(!req.params.jobIds) {
    return next(badRequest('Specify job IDs'));
  }
  
  const jobIds = req.params.jobIds.split(',');
  
  const jobs = await Job.findAll({
    where: { id: { $in: jobIds } },
    include: [ { model: Order, include: [ ContactInfo ] } ],
    order: [ [ Order, 'createdAt' ], [ Order, 'orderIdentifier' ] ]
  });
  
  res.send({ jobs: jobs.map(jobToJson) });
});

router.get('/ready-for-invoice', async function (req, res) {
  const jobs = await Job.findAll({
    where: { state: 'ready_for_invoice' },
    include: [ { model: Order, include: [ ContactInfo ] } ],
    order: [ [ Order, 'createdAt' ], [ Order, 'orderIdentifier' ] ]
  });
  res.send({ jobs: jobs.map(jobToJson) });
});

router.get('/paid', async function (req, res) {
  const jobs = await Job.findAll({ where: { paid: true } });

  res.send({ jobs });
});

module.exports = router;
