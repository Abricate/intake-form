import BoxSDK from 'box-node-sdk';
import fs from 'fs';
import _ from 'lodash';

import { promisify, reduce } from '../util';
import config from '../config';

const boxClient = new BoxSDK(config.box.sdk).getAppAuthClient('enterprise', config.box.enterpriseID);

const Limit = 100;

function getPage(fn, _args, offset = 0, limit = Limit, count = 0) {
  const args = _args.slice(0, -1);

  // replace offset and limit in params
  const params = {
    ..._args[args.length-1],
    offset,
    limit
  };

  return fn(...args, params).then( result => {

    const newCount = count + result.entries.length;
    
    let next = () => (
      getPage(fn, _args, offset+limit, limit, newCount)
    );

    if(newCount >= result.total_count) {
      // no more pages
      next = null;
    }
    
    return {
      entries: result.entries,
      next
    };
  });
}

const transform = _fn => (...args) => {
  const fn = promisify(_fn);

  let params = args[args.length-1];
  let offset = undefined, limit = undefined;
  
  if(typeof params === 'object') {
    offset = params.offset;
    limit = params.limit;
  }
  
  return getPage(fn, args, offset, limit);
};

const methods = {
  folders: {
    'getItems': transform,
    'create': promisify
  },
  files: {
    'copy': promisify,
    'get': promisify,
    'uploadFile': promisify,
    'getDownloadURL': promisify,
    'update': promisify
  },
  metadata: {
    'createTemplate': promisify
  }
}

const box = _.mapValues(methods, (objectMethods, objectName) =>
  _.mapValues(objectMethods, (fn, methodName) => 
    fn(boxClient[objectName][methodName].bind(boxClient[objectName]))
  )
);

export default box;

// find the 'orders' and 'uploads' folders
const BoxFolders =
  box.folders.getItems('0', {fields: 'name'}).then( stream =>
    reduce(stream)((acc, x) => {
      if(acc.hasOwnProperty(x.name) && x.type === 'folder') {
        return {
          ...acc,
          [x.name]: x
        }
      } else {
        return acc;
      }
    }, {'orders': null , 'uploads': null})
  );

export async function uploadFileToBox(filename, destinationFilename) {
  const folders = await BoxFolders;
  if(folders.uploads == null) throw Error('no folder "uploads" found in Box');

  const stream = fs.createReadStream(filename);
  const closeStream = () => stream.close();
  
  const result = box.files.uploadFile(folders.uploads.id, destinationFilename, stream);

  // clean up
  result.then(closeStream, closeStream);
  
  return result;
}
