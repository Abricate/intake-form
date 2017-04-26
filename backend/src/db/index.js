import crypto from 'crypto';
import Sequelize from 'sequelize';

import { promisify } from '../util';

import config from '../config';

const randomBytes = promisify(crypto.randomBytes);

const { database, username, password, ...options } = config.db;

var sequelize = new Sequelize(database, username, password, options);

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

export const Order = sequelize.define('order', {
  orderIdentifier: {type: Sequelize.STRING(16), unique: true}
});

export const Job = sequelize.define('job', {
  props: Sequelize.TEXT,
  quantity: Sequelize.INTEGER,
  dueDate: Sequelize.DATE,
  pipedriveUrl: Sequelize.STRING
});

export const File = sequelize.define('file', {
  provider: Sequelize.STRING(16), // currently, only 'box'
  path: Sequelize.STRING
});

File.belongsTo(Job);
Job.belongsTo(Order);
Job.hasMany(File);
Order.belongsTo(User);
Order.hasMany(Job);
User.hasMany(Order);

export async function createOrder() {
  let tries = 100;
  
  while(tries > 0) {
    const orderIdentifier = await randomBytes(8).then(x => x.toString('hex'));
    
    const [ order, created ] = await Order.findOrCreate({
      where: { orderIdentifier }
    });

    if(created) {
      return order;
    }

    tries -= 1;
  }

  throw Error('failed to create order with unique orderIdentifier');
}


export function init() {
  return sequelize.sync();
}
