import { exec } from 'child_process';

import config from '../backend/src/config';

const db = config.db;

let dbUrl = null;
if(db && db.dialect && db.host && db.database) {
  const credentials = [db.username, db.password].filter( x => !!x ).join(':');
  dbUrl = (db.dialect + '://' + (credentials != '' ? credentials + '@' : '') + db.host + (db.port ? ':' + db.port : '') + '/' + db.database);
} else if(db.uri) {
  dbUrl = db.uri;
} else {
  console.log("no database config found", db, config);
  process.exit(1);
}
  
const [,, task, ...rest] = process.argv;
const commandLine = `sequelize ${task} --url "${dbUrl}" ${rest.join(' ')}`;
console.log(commandLine);
const newProcess = exec(commandLine);
newProcess.stdout.pipe(process.stdout);
newProcess.stderr.pipe(process.stderr);
