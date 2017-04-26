import fs from 'fs'
import path from 'path'

const config = {
  development: {
    db: {
      database: 'abricate',
      host: 'localhost',
      port: 5433,
      dialect: 'postgres',
    },
    box: {
      clientID: '7eory32ext4xkahh1lv1oxkpaavc92ey',
      clientSecret: 'V8yf0pb0GCUQ6Ic6UWyOkPw4CZtj47dM',
      appAuth: {
        keyID: '8m0joffz',
        privateKey: fs.readFileSync(path.join(__dirname, '..', 'box_private_key.pem'), {encoding: 'ASCII'}),
        passphrase: fs.readFileSync(path.join(__dirname, '..', 'box_private_key.passphrase'), {encoding: 'ASCII'}).trim()
      }
    },
    pipedrive: {
      token: 'a4e2a12063820ab1b87994a3c0dbe4f957cb16e7' // <-- sandbox key. production key: 'aafe2fba2dcd9f80f686c7dc28f14b9b70f65698'
    }
  }
}

const EnvName = process.env.NODE_ENV

export default config[EnvName] || config.development;

