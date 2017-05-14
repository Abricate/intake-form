import _ from 'lodash';

import db, { Order, BoxFile, User, PipedrivePerson, Job, createOrder } from '../db';
import pipedrive from '../clients/pipedrive';
import box from '../clients/box';

const router = require('express-promise-router')();

const createJob = order => async job => {
  const { quantity, dueDate, files, ...props } = job;

  const dbJob = await Job.create({
    orderId: order.id,
    props: JSON.stringify(props),
    quantity,
    dueDate
  });

  const fileIdentifiers = _.map(files, 'filename');
  const boxFiles = await BoxFile.findAll({where: {identifier: {$in: fileIdentifiers}}});
  await dbJob.addFiles(boxFiles);

  return {job: dbJob, boxFiles};
};

const customFields = new Set([
  'Files',
  'Material',
  'Tolerance',
  'Turn Around',
  'Vendor',
]);

const customFieldKeys = pipedrive.DealFields.getAll().then( fields => {
  const pairs = fields.filter( field =>
    customFields.has(field.name)
  ).map( field =>
    [field.name, field.key]
  );

  return _.fromPairs(pairs);
})

async function addDeal(_deal) {
  const fields = await customFieldKeys;

  const { custom, ...deal } = _deal;

  /*
   * e.g. { 'Box Folder': 'https://box.com/foo/bar' } -> {'123debcaf123': 'https://box.com/foo/bar'}
   */
  const customDataWithCodedKeys = _.mapKeys(
    custom,
    (value, key) => fields[key]
  );

  const dealWithCustomData = {
    ...deal,
    ...customDataWithCodedKeys
  };

  return await pipedrive.Deals.add(dealWithCustomData);
}

router.post('/', async function(req, res) {
  const { cart, contactInfo } = req.body;
  
  const [ user ] = await User.findOrCreate({
    where: { email: contactInfo.email },
    defaults: contactInfo,
    include: [ PipedrivePerson ]
  });

  // order has many jobs
  const order = await createOrder({userId: user.id});
  const jobs = await Promise.all(cart.map(createJob(order)));
  await order.createContactInfo(contactInfo);
  
  let pipedrivePerson = user.pipedrive_person;

  if(pipedrivePerson == null) {
    const response = await pipedrive.Persons.add({
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phoneNumber
    });
    
    pipedrivePerson = await PipedrivePerson.create({
      userId: user.id,
      personId: response.id.toString()
    })
  }
  
  // create deal(s) in pipedrive
  await Promise.all(jobs.map( async ({job, boxFiles}) => {
    const jobProps = job.propsParsed();
    
    const deal = await addDeal({
      title: `${contactInfo.name} deal (${jobProps.dueDate ? jobProps.dueDate + ' ' : ''}${order.orderIdentifier})`,
      person_id: pipedrivePerson && parseInt(pipedrivePerson.personId),
      custom: {
        'Files': _.map(boxFiles, 'sharedLinkUrl').join(' '),
        'Material': jobProps.material,
        'Tolerance': jobProps.tolerance
      }
    });
    await Job.update({pipedriveDealId: deal.id}, {where: {id: job.id}})
  }));
  
  res.send({ userId: user.id, orderIdentifier: order.orderIdentifier });
});

module.exports = router;
