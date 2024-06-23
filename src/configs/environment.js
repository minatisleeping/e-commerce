require('dotenv').config()

module.exports.env = {
  PORT: process.env.PORT,

  // MONGO config
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  CLUSTER: process.env.CLUSTER_CONFIG,
}

// const dev = {
//   app: { PORT: process.env.PORT },
//   db: {
//     USERNAME: process.env.USERNAME,
//     PASSWORD: process.env.PASSWORD,
//     CLUSTER_CONFIG: process.env.CLUSTER,
//   }
// }

// const pro = {
//   app: { PORT: process.env.PORT },
//   db: {
//     USERNAME: process.env.USERNAME,
//     PASSWORD: process.env.PASSWORD,
//     CLUSTER_CONFIG: process.env.CLUSTER,
//   }
// }

// const config = { dev, pro }
// const env = process.env.NODE_ENV || 'dev'
// module.exports = config[env]

