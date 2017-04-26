const config = {
  development: {
    db: {
      database: 'abricate',
      host: 'localhost',
      port: 5433,
      dialect: 'postgres',
    }
  }
}

const EnvName = process.env.NODE_ENV

export default config[EnvName] || config.development;

