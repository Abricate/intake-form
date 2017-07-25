import _ from 'lodash';
import { expect } from './helper';

import { PipedriveWebhooks } from '../src/routes/pipedrive-webhooks';
import { Job, InvoiceLineItem } from '../src/db';


const customFieldNames = [
  'Files',
  'Material',
  'Color',
  'Material Thickness',
  'Comments',
  'Quantity',
  'Due Date',
  'Shipping Address',
  'CM: Catalog Link',
  'CM: Product Name',
  'CM: Product ID',
  'CM: Dimensions',
  'CM: Price',
  'CM: MSDS Link',
  'Unit Price'
];

const customFields = _.chain(customFieldNames).map((fieldName, index) => [`customfield_${index}`, fieldName]).fromPairs().value();

const stages = {
  1: 'FORM IN',
  2: 'READY FOR INVOICE'
};

function objectKeysToCustomFieldNames(object) {
  return _.mapKeys( object, (value, key) => _.findKey(customFields, fieldName => fieldName === key) );
}

function createWebhookPayload(dealId, previousStage, currentStage, _previous, _current) {
  const previousStageId = _.findKey(stages, stage => stage === previousStage);
  const currentStageId = _.findKey(stages, stage => stage === currentStage);

  const action = (previous === null) ? 'added' : 'updated'
  
  const current = {
    ...objectKeysToCustomFieldNames(_current),
    stage_id: currentStageId
  };
  
  const previous = {
    ...objectKeysToCustomFieldNames(_previous),
    stage_id: previousStageId
  };

  return ({
    current,
    "meta": {
      action,
      "id": dealId,
      "object": "deal",
    },
    previous
  });
}

describe('pipedrive-webhooks', function() {
  let pipedriveWebhooks;
  let initialJob;
  
  const pipedriveDealId = 'pipedrive-id-1';
  
  beforeEach(async function() {
    await Job.destroy({ where: {pipedriveDealId} });
    
    initialJob = await Job.create({
      quantity: 1,
      pipedriveDealId: 'pipedrive-id-1',
      paid: false
    });


    pipedriveWebhooks = new PipedriveWebhooks({
      getStageName: id => stages[id],
      pipedriveCustomFields: customFields
    });
  });
  
  describe('handlePipedriveDealUpdate', function() {
    it('should create invoice line item when price is set', async function() {
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload(
        pipedriveDealId,
        'FORM IN',
        'FORM IN',
        {},
        {'Unit Price': 12.34}
      ));
      
      const job = await Job.findById(initialJob.id, {include: [ InvoiceLineItem ] });
      expect(job.invoice_line_items).to.have.lengthOf(1);
      const [ item ] = job.invoice_line_items;
      expect(item).to.have.property('unitPrice', '12.34');
    });

    it('should update existing invoice line item when price is changed', async function() {
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload(
        pipedriveDealId,
        'FORM IN',
        'FORM IN',
        {},
        {'Unit Price': 12.34}
      ));
      
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload(
        pipedriveDealId,
        'FORM IN',
        'FORM IN',
        {},
        {'Unit Price': 12.56}
      ));

      const job = await Job.findById(initialJob.id, {include: [ InvoiceLineItem ] });
      expect(job.invoice_line_items).to.have.lengthOf(1);
      const [ item ] = job.invoice_line_items;
      expect(item).to.have.property('unitPrice', '12.56');      
    });

    it('should update job state', async function() {
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload(
        pipedriveDealId,
        'FORM IN',
        'READY FOR INVOICE',
        {},
        {'Unit Price': 12.34}
      ));
      const job = await Job.findById(initialJob.id);
      expect(job).to.have.property('state', 'READY FOR INVOICE');
    });
  });
});
