import db, { File, User, Job, createOrder } from '../db';

const router = require('express-promise-router')();

const createJob = order => async job => {
  const { quantity, dueDate, files, ...props } = job;

  const dbJob = await Job.create({
    orderId: order.id,
    props: JSON.stringify(props),
    quantity,
    dueDate
  });

  await Promise.all(files.map(file => (
    File.create({
      jobId: dbJob.id,
      provider: 'box',
      path: file.filename
    })
  )));

  return job;
}; 
  

router.post('/', async function(req, res) {
  const { cart, contactInfo } = req.body;
    
  const [ user ] = await User.findOrCreate({
    where: { email: contactInfo.email },
    defaults: { contactInfo }
  });

  const order = await createOrder();

  const jobs = await Promise.all(cart.map(createJob(order)));
      
  res.send({ userId: user.id, orderIdentifier: order.orderIdentifier });
  
  // create job(s)
  
  // move files from uploads folder to <orderIdentifier>/*
  // create deal in pipedrive
//  console.log(req);
//  res.send({});
});

module.exports = router;
