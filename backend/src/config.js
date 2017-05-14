import fs from 'fs'
import path from 'path'

const config = {
  '*': {
    box: {
      sdk: {
        clientID: '7eory32ext4xkahh1lv1oxkpaavc92ey',
        clientSecret: 'V8yf0pb0GCUQ6Ic6UWyOkPw4CZtj47dM',
        appAuth: {
          keyID: '8m0joffz',
          privateKey: process.env.BOX_PRIVATE_KEY || fs.readFileSync(path.join(__dirname, '..', 'box_private_key.pem'), {encoding: 'ASCII'}),
          passphrase: "passphrase"
        }
      },
      enterpriseID: '611963'
    },
  },    
  development: {
    db: {
      database: 'abricate',
      host: 'localhost',
      port: 5433,
      dialect: 'postgres',
    },
    pipedrive: {
      token: 'b8560bf3dc15905f41f65650604cddc2f11038c0' // <-- sandbox key. production key: 'aafe2fba2dcd9f80f686c7dc28f14b9b70f65698'
    }
  },
  production: {
    db: {
      uri: process.env.DATABASE_URL
    },
    pipedrive: {
      token: 'a4e2a12063820ab1b87994a3c0dbe4f957cb16e7'
    }
  }
}

const EnvName = process.env.NODE_ENV
const envConfig = config[EnvName] || config.development;

export default {
  ...config['*'],
  ...envConfig
}
