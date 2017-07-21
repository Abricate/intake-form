import crypto from 'crypto';
import expressBasicAuth from 'express-basic-auth';

import { promisify } from '../util';
import config from '../config';
import customFields from '../pipedrive-custom-fields';
import { Job, JobFile, InvoiceLineItem } from '../db';
import diff from '../util';
import pipedrive from '../clients/pipedrive';

const randomBytes = promisify(crypto.randomBytes);

const router = require('express-promise-router')();

if(config.pipedrive.webooks) {
  const users = {
    [config.pipedrive.webhooks.username]: config.pipedrive.webhooks.password
  };

  router.use(expressBasicAuth({ users }));
}

const pipedriveToInvoiceLineItemMapping = {
  'Unit Price': 'unitPrice'
};

const pipedriveToJobMapping = {
  'Material': 'material',
  'Color': 'color',
  'Material Thickness': 'materialThickness',
  'Comments': 'comments',
  'Quantity': 'quantity',
  'Due Date': 'dueDate',
};

const pipedriveToJobPropsMapping = {
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
    this.getStageName = getStageName;
    this.pipedriveCustomFields = pipedriveCustomFields;

    this.middleware = this.middleware.bind(this);
  }


  async handlePipedriveDealUpdate(body) {
    const job = await this.getJobForPipedriveDealId(body.meta.id);
    const customFields = await this.pipedriveCustomFields;
    if(job) {
      const updatedFields = diff(body.previous, body.current);

      const updatedFieldsMapped = _.mapKeys(updatedFields, (value, key) =>
        customFields.hasOwnProperty(key) ? customFields[key] : key
      );

      const jobFieldsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToJobMapping.hasOwnProperty(key) ? pipedriveToJobMapping[key] : null
        ), null
      );

      const jobPropsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToJobPropsMapping.hasOwnProperty(key) ? pipedriveToJobPropsMapping[key] : null
        ), null
      );

      const props = job.propsParsed();

      let state = {};
      if(updatedFields.stage_id != undefined) {
        state = { state: this.getStageName(updatedFields.stage_id) };
      }
                                             
      await job.update({
        ...jobFieldsToUpdate,
        props: JSON.stringify({...props, jobPropsToUpdate}),
        ...state
      });

      const invoiceLineItemFieldsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToInvoiceLineItemMapping.hasOwnProperty(key) ? pipedriveToInvoiceLineItemMapping[key] : null
        ), null
      );
      
      const [ invoiceLineItem, created ] = await InvoiceLineItem.findOrCreate({
        where: { jobId: job.id },
        defaults: {
          props: JSON.stringify({ job }),
          quantity: job.quantity,
          ...invoiceLineItemFieldsToUpdate
        }
      });

      if(!created) {
        await invoiceLineItem.update({
          quantity: job.quantity,
          ...invoiceLineItemFieldsToUpdate
        });
      }
    }
  }

  async middleware(req, res, next) {
    const body = req.body;
    
    if(body.event === 'updated.deal') {
      await this.handlePipedriveDealUpdate(body);
      res.send('ok');
    }
  }
}

const { middleware } = new PipedriveWebhooks({
  getJobForPipedriveDealId: id => Job.find({where: {pipedriveDealId: id.toString()}, include: [ JobFile ]}),
  getStageName,
  pipedriveCustomFields: customFields
});

router.post('/', middleware);

module.exports = router;
