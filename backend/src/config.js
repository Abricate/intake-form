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
    }
  },
  test: {
    db: {
      database: 'abricate-test',
      host: 'localhost',
      port: process.env.DB_PORT || 5433,
      dialect: 'postgres',
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
      token: '089c18ff00d38f1ed32d586de51d45c8ac588cc6' // <-- 'sandbox4' key
    },
    adminDomainWhitelist: [
      'jaredlux.com',
      'abricate.com'
    ],
    google: {"web":{"client_id":"529243456287-3mh6e015btvgmnjqb1o3fpc1poq4qps9.apps.googleusercontent.com","project_id":"abricate-173804","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"5kf58aSOWaWYTry8chmog_Zq","redirect_uris":["http://localhost:3001/auth/google/callback"],"javascript_origins":["http://localhost:3101"]}}
  },
  production: {
    db: {
      uri: process.env.DATABASE_URL
    },
    adminDomainWhitelist: [
      'jaredlux.com',
      'abricate.com'
    ],
    pipedrive: {
      token: '06e92cde99f28431e993b8bafc67ad4dd7a5e76d', // <-- this is Andy Lee's API key
      webhooks: {
        username: '913f91895a8323e4184ed825034dd40c',
        password: '58c09aecba8c7c4bf892760d56e2bf69'
      }
    },
    google: {
      // from https://console.cloud.google.com/apis/credentials/oauthclient/529243456287-3pibdb1uijepbb23c8t3aa7rg09lppoh.apps.googleusercontent.com?project=abricate-173804&organizationId=848760392749
      "web": {
        "client_id":"529243456287-3pibdb1uijepbb23c8t3aa7rg09lppoh.apps.googleusercontent.com",
        "project_id":"abricate-173804",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"l1pDDDYJuL1Nm2eOPqMuYikv",
        "redirect_uris":["https://jobrequest.abricate.com/login"],
        "javascript_origins":["https://jobrequest.abricate.com"]
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
