const dotenv = require('dotenv')
dotenv.config()

module.exports.env = {
  PORT: process.env.PORT,
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD
}
