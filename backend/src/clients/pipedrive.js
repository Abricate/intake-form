import _ from 'lodash';
import Pipedrive from 'pipedrive';

import config from '../config';
import { promisify } from '../util';

const client = new Pipedrive.Client(config.pipedrive.token, { strictMode: true });

const objects = [
  'Activities',
  'ActivityTypes',
  'Authorizations',
  'Currencies',
  'Deals',
  'DealFields',
  'Files',
  'Filters',
  'Notes',
  'Organizations',
  'OrganizationFields',
  'Persons',
  'PersonFields',
  'Pipelines',
  'Products',
  'ProductFields',
  'SearchResults',
  'Stages',
  'Users',
]

const methods = [
  'add',
  'get',
  'update',
  'getAll',
  'remove',
  'removeMany',
  'merge',
  'find',
]

// Filter client so that only objects and methods above remain,
// then promisify each method
export default _.mapValues(
  _.pick(client, objects),
  object => _.mapValues(_.pick(object, methods), promisify)
);
