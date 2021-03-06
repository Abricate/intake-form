import expressBasicAuth from 'express-basic-auth';
import expressPromiseRouter from 'express-promise-router';
import _ from 'lodash';

import { promisify } from '../util';
import config from '../config';
import customFields from '../pipedrive-custom-fields';
import { Job, JobFile } from '../db';
import { diff } from '../util';
import pipedrive from '../clients/pipedrive';

const pipedriveToJobPropsMapping = {
  'Material': 'material',
  'Color': 'color',
  'Material Thickness': 'materialThickness',
  'Comments': 'comments',
  'Quantity': 'quantity',
  'Due Date': 'dueDate',
  'CM: Catalog Link': 'customMaterial.catalogLink',
  'CM: Product Name': 'customMaterial.productName',
  'CM: Product ID': 'customMaterial.productId',
  'CM: Dimensions': 'customMaterial.dimensions',
  'CM: Price': 'customMaterial.price',
  'CM: MSDS Link': 'customMaterial.msdsLink',
  'Unit Price': 'unitPrice'
};

const pipedriveStateMapping = {
  'FORM IN': 'form_in',
  'VERIFY FILES': 'verify_files',
  'QUOTE JOB': 'quote_job',
  'READY FOR INVOICE': 'ready_for_invoice',
  'INVOICE SENT': 'invoice_sent',
  'REVIEW FOR SHOP': 'review_for_shop',
  'SENT TO SHOP': 'sent_to_shop',
  'IN PRODUCTION': 'in_production',
  'QC & DELIVERY': 'qc_and_delivery',
  'CUSTOMER FOLLOWUP': 'custom_followup',
  'SHOP PAID': 'shop_paid'
};

let stageNames = {};
export async function pipedriveGetStageName(id) {
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
  constructor({
    getJobForPipedriveDealId = id => Job.find({where: {pipedriveDealId: id.toString()}}),
    getStageName = pipedriveGetStageName,
    pipedriveCustomFields = customFields()
  }) {
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

      const updatedFieldsMapped = _.mapKeys(updatedFields, (value, encodedKey) => {
        const fieldName = _.findKey(customFields, x => encodedKey === x);
        if(fieldName !== undefined) {
          return fieldName;
        } else {
          return null;
        }
      });

      const jobPropsToUpdate = _.omit(
        _.mapKeys(updatedFieldsMapped, (value, key) =>
          pipedriveToJobPropsMapping.hasOwnProperty(key) ? pipedriveToJobPropsMapping[key] : null
        ), null
      );

      const props = job.propsParsed();

      let state = {};
      if(updatedFields.stage_id != undefined) {
        const stageName = await this.getStageName(updatedFields.stage_id);
        const stateName = pipedriveStateMapping[stageName];
        
        if(stageName != null && stateName == null) {
          console.error('unknown state from Pipedrive webhook', { updatedFields, stageName, pipedriveStateMapping });
        } else {
          state = { state: stateName };
        }
      }
      
      await job.update({
        props: JSON.stringify({...props, ...jobPropsToUpdate}),
        ...state
      });
    }
  }

  async middleware(req, res, next) {
    const body = req.body;
    
    if(body.meta.action === 'updated' && body.meta.object === 'deal') {
      await this.handlePipedriveDealUpdate(body);
      res.send('ok');
    }
  }
}

export default () => {
  const router = expressPromiseRouter();

  if(config.pipedrive.webooks) {
    const users = {
      [config.pipedrive.webhooks.username]: config.pipedrive.webhooks.password
    };

    router.use(expressBasicAuth({ users }));
  }
  
  const { middleware } = new PipedriveWebhooks({});

  router.post('/', middleware);
  
  return router;
};
