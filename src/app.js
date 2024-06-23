const express = require('express')
const morgan  = require('morgan')
const helmet  = require('helmet')
const compression = require('compression')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
require('./database/init.mongodb')
// const { countConnection, checkOverload } = require('./helpers/check.connect')
// countConnection()
// checkOverload()
// init routes
app.get('/', (req, res, next) => {
  return res.status(200).json({ message: 'hello tips js' })
})
// handling errors

module.exports = app
