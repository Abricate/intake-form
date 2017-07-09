import expressBasicAuth from 'express-basic-auth';

import config from '../config';
import customFields from '../pipedrive-custom-fields';
import { Job } from '../db';
import diff from '../util';
import pipedrive from '../clients/pipedrive';

const router = require('express-promise-router')();

if(config.pipedrive.webooks) {
  const users = {
    [config.pipedrive.webhooks.username]: config.pipedrive.webhooks.password
  };

  router.use(expressBasicAuth({ users }));
}

const pipedriveToDatabaseMapping = {
  'Material': 'material',
  'Color': 'color',
  'Material Thickness': 'materialThickness',
  'Comments': 'comments',
  'Quantity': 'quantity',
  'Due Date': 'dueDate',
};

const pipedriveToDatabasePropsMapping = {
  'CM: Catalog Link': 'customMaterial.catalogLink',
  'CM: Product Name': 'customMaterial.productName',
  'CM: Product ID': 'customMaterial.productId',
  'CM: Dimensions': 'customMaterial.dimensions',
  'CM: Price': 'customMaterial.price',
  'CM: MSDS Link': 'customMaterial.msdsLink'
};

const ReadyForInvoice = 'READY FOR INVOICE';

let stageNames = {};
async function getStageName(id) {
  if(stageNames.hasOwnProperty(id)) {
    return stageNames[id];
  } else {
    const stage = await pipedrive.Stages.get(id);

    if(stage) {
      stageNames[id] = stage.name;
    } else {
      stageNames[id] = null;
    }

    return stageNames[id];
  }
}

export class PipedriveWebhooks {
  constructor({ getJobForPipedriveDealId, getStageName, pipedriveCustomFields }) {
    this.getJobForPipedriveDealId = getJobForPipedriveDealId;
    this.getStateName = getStageName;
    this.pipedriveCustomFields = pipedriveCustomFields;
  }


  async handlePipedriveDealUpdate(body) {
    const job = await this.getJobForPipedriveDealId(body.meta.id);
    const customFields = await this.pipedriveCustomFields();
    if(job) {
      const updatedFields = diff(body.previous, body.current);

      const updatedFieldsMapped = _.mapKeys(updatedFields, (value, key) =>
        customFields.hasOwnProperty(key) ? customFields[key] : key
      );

      const jobFieldsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToDatabaseMapping.hasOwnProperty(key) ? pipedriveToDatabaseMapping[key] : null
        ), null
      );

      const jobPropsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToDatabasePropsMapping.hasOwnProperty(key) ? pipedriveToDatabaseMapping[key] : null
        ), null
      );

      const props = job.propsParsed();

      await job.update({
        ...jobFieldsToUpdate,
        props: JSON.stringify({...props, jobPropsToUpdate})
      });

      if(updatedFieldsMapped.hasOwnProperty('stage_id')) {
        const stageName = this.getStageName(updatedFieldsMapped.stage_id);

        if(stageName === ReadyForInvoice) {
          
          InvoiceLineItem.find({where: {jobId: 
          // if exists, update InvoiceLineItem for this Job
          // else:
          //   create InvoiceLineItem for this Job
          //   if non-published Invoice already attached to this Order, attach line item to that Invoice
          //   else, create a new Invoice and attach to this Order
          // 
        }
      }
    }
  }

  async middleware(req, res, next) {
    const body = req.body;
    
    if(body.event === 'updated.deal') {
      await handlePipedriveDealUpdate(body);
      res.send('ok');
    }
  }
}

const { middleware } = new PipedriveWebhooks({
  getJobForPipedriveDealId: id => Job.find({where: {pipedriveDealId: id.toString()}}),
  getStageName,
  pipedriveCustomFields: customFields
});

router.post('/', middleware);

export default router;
