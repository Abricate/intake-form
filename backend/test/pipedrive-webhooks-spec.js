import _ from 'lodash';
import sinon from 'sinon';

import { expect } from './helper';

import { PipedriveWebhooks } from '../src/routes/pipedrive-webhooks';
import { Job } from '../src/db';

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

const customFields = _.chain(customFieldNames).map((fieldName, index) => [fieldName, `customfield_${index}`]).fromPairs().value();

const stages = {
  1: 'FORM IN',
  2: 'READY FOR INVOICE',
  3: 'FOOBAR BAZ'
};

const pipedriveToJobPropsMapping = {
  'Material': ['material', 'Plastic'],
  'Color': ['color', 'red'],
  'Material Thickness': ['materialThickness', '1/4"'],
  'Comments': ['comments', 'foo bar baz'],
  'Quantity': ['quantity', 12],
  'Due Date': ['dueDate', '2017-01-04'],
  'CM: Catalog Link': ['customMaterial.catalogLink', 'https://www.example.com'],
  'CM: Product Name': ['customMaterial.productName', 'product name'],
  'CM: Product ID': ['customMaterial.productId', 'id-12345'],
  'CM: Dimensions': ['customMaterial.dimensions', "5'x6'"],
  'CM: Price': ['customMaterial.price', '$1500'],
  'CM: MSDS Link': ['customMaterial.msdsLink', 'https://www.example.com']
};

function objectKeysToCustomFieldNames(object) {
  return _.mapKeys( object, (value, key) => customFields[key] );
}

const pipedriveDealId = 'pipedrive-id-1';
function createWebhookPayload({
  dealId = pipedriveDealId,
  previousStage = 'FORM IN',
  currentStage = 'FORM IN',
  previousDeal = {},
  currentDeal = {}
}) {
  const previousStageId = _.findKey(stages, stage => stage === previousStage);
  const currentStageId = _.findKey(stages, stage => stage === currentStage);

  const action = (previous === null) ? 'added' : 'updated'
  
  const current = {
    ...objectKeysToCustomFieldNames(currentDeal),
    stage_id: currentStageId
  };
  
  const previous = {
    ...objectKeysToCustomFieldNames(previousDeal),
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
  
  beforeEach(async function() {
    await Job.destroy({ where: {pipedriveDealId} });
    
    initialJob = await Job.create({
      pipedriveDealId: 'pipedrive-id-1',
      paid: false,
      props: '{}'
    });


    pipedriveWebhooks = new PipedriveWebhooks({
      getStageName: async id => stages[id],
      pipedriveCustomFields: customFields
    });
  });
  
  describe('handlePipedriveDealUpdate', function() {
    it('should add unitPrice props when price is set', async function() {
      let job = await Job.findById(initialJob.id);
      expect(job.propsParsed().unitPrice).to.be.undefined;

      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
        currentDeal: {'Unit Price': 12.34}
      }));
      
      job = await Job.findById(initialJob.id);
      expect(job.propsParsed().unitPrice).to.equal(12.34);
    });

    it('should update job when price is changed', async function() {
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
        currentDeal: {'Unit Price': 12.34}
      }));
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
        currentDeal: {'Unit Price': 12.35}
      }));
      
      const job = await Job.findById(initialJob.id);
      expect(job.propsParsed().unitPrice).to.equal(12.35);
    });

    it('should update job state', async function() {
      let job = await Job.findById(initialJob.id);
      expect(job).to.have.property('state', null);
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
        currentStage: 'READY FOR INVOICE'
      }));
      job = await Job.findById(initialJob.id);
      expect(job).to.have.property('state', 'ready_for_invoice');
    });

    it('should reject unknown job state', async function() {
      let job = await Job.findById(initialJob.id);
      expect(job).to.have.property('state', null);

      const consoleErrorStub = sinon.stub(console, "error");
      await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
        currentStage: 'FOOBAR BAZ'
      }));
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledWith(sinon.match(/unknown state from Pipedrive/)));
      consoleErrorStub.restore();
      
      job = await Job.findById(initialJob.id);
      expect(job).to.have.property('state', null);
    });

    it('should have a getStageName function', async function() {
      pipedriveWebhooks = new PipedriveWebhooks({pipedriveCustomFields: null, getJobForPipedriveDealId: null});
      expect(pipedriveWebhooks.getStageName).to.not.be.undefined;
    });
      
      describe('job props', function() {
      _.forEach(pipedriveToJobPropsMapping, ([jobField, value], pipedriveField) => {
        it(`should update ${jobField}`, async function() {
          let job = await Job.findById(initialJob.id);
          expect(job.propsParsed()).to.eql({});
          await pipedriveWebhooks.handlePipedriveDealUpdate(createWebhookPayload({
            currentDeal: {[pipedriveField]: value}
          }));
          job = await Job.findById(initialJob.id);
          expect(job.propsParsed()).to.have.property(jobField, value);
        });
      });
    });
  });
});
