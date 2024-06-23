const dotenv = require('dotenv')
dotenv.config()

// export theo kiểu đặt tên biến
module.exports.env = {
  PORT: process.env.PORT,
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD
}
