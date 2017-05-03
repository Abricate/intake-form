import crypto from 'crypto';
import Sequelize from 'sequelize';
import _ from 'lodash';

import { promisify } from '../util';

import config from '../config';

const randomBytes = promisify(crypto.randomBytes);

const { uri, database, username, password, ...options } = config.db;

var sequelize = uri != null ? new Sequelize(uri, options) : new Sequelize(database, username, password, options);

export default sequelize;

export const User = sequelize.define('user', {
  email: {type: Sequelize.STRING, unique: true},
  name: Sequelize.STRING,
  phoneNumber: Sequelize.STRING,
  address1: Sequelize.STRING,
  address2: Sequelize.STRING,
  zipcode: Sequelize.STRING,
  country: Sequelize.STRING
});

export const PipedrivePerson = sequelize.define('pipedrive_person', {
  personId: Sequelize.STRING
});

export const Order = sequelize.define('order', {
  orderIdentifier: {type: Sequelize.STRING(16), unique: true}
});

export const Job = sequelize.define('job', {
  props: Sequelize.TEXT,
  quantity: Sequelize.INTEGER,
  dueDate: Sequelize.DATE,
  pipedriveDealId: Sequelize.STRING,
},{
  instanceMethods: {
    propsParsed: function() {
      return JSON.parse(this.props);
    }
  }
});

export const ContactInfo = sequelize.define('contact_info', {
  email: Sequelize.STRING,
  name: Sequelize.STRING,
  phoneNumber: Sequelize.STRING,
  address1: Sequelize.STRING,
  address2: Sequelize.STRING,
  zipcode: Sequelize.STRING,
  country: Sequelize.STRING
}, {tableName:  'contact_info'});

export const JobFiles = sequelize.define('job_files', {
  type: Sequelize.STRING,
}, {indexes: [{fields: ['type']}]});

export const BoxFile = sequelize.define('box_file', {
  identifier: {type: Sequelize.STRING(16), unique: true},
  boxId: {type: Sequelize.STRING, unique: true},
  sharedLinkUrl: Sequelize.TEXT,
  downloadUrl: Sequelize.TEXT  
});

Job.belongsToMany(BoxFile, { as: 'Files', through: {model: JobFiles, scope: {type: 'BoxFile'}} });
BoxFile.belongsToMany(Job, { as: 'Jobs', through: {model: JobFiles, scope: {type: 'BoxFile'}} });
User.hasOne(PipedrivePerson);
PipedrivePerson.belongsTo(User);
BoxFile.belongsTo(Job);
Job.belongsTo(Order);
Job.hasMany(BoxFile);
Order.belongsTo(User);
Order.hasMany(Job);
User.hasMany(Order);
ContactInfo.belongsTo(Order);
Order.hasOne(ContactInfo, {as: 'ContactInfo'});

export async function createOrder(order) {
  let tries = 100;
  
  while(tries > 0) {
    const orderIdentifier = await randomBytes(8).then(x => x.toString('hex'));
    
    const [ order, created ] = await Order.findOrCreate({
      where: { orderIdentifier },
      defaults: order
    });

    if(created) {
      return order;
    }

    tries -= 1;
  }

  throw Error('failed to create order with unique orderIdentifier');
}

export async function createBoxFile(boxFile) {
  console.log('createBoxFile', boxFile);
  let tries = 100;
  
  while(tries > 0) {
    const identifier = await randomBytes(8).then(x => x.toString('hex'));
    
    const [ result, created ] = await BoxFile.findOrCreate({
      where: { identifier },
      defaults: boxFile
    });

    if(created) {
      return result;
    }

    tries -= 1;
  }

  throw Error('failed to create boxFile with unique identifier');
}


sequelize.sync();
