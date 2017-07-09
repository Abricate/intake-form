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
      token: 'be29aa61e20716913c60a2646a6073090ba63523' // <-- sandbox key. production key: 'aafe2fba2dcd9f80f686c7dc28f14b9b70f65698'
    }
  },
  production: {
    db: {
      uri: process.env.DATABASE_URL
    },
    pipedrive: {
      token: '06e92cde99f28431e993b8bafc67ad4dd7a5e76d', // <-- this is Andy Lee's API key
      webhooks: {
        username: '913f91895a8323e4184ed825034dd40c',
        password: '58c09aecba8c7c4bf892760d56e2bf69'
      }
    }
  }
}

const EnvName = process.env.NODE_ENV
const envConfig = config[EnvName] || config.development;

export default {
  ...config['*'],
  ...envConfig
}
