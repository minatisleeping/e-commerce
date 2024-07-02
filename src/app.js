const express = require('express')
const morgan  = require('morgan')
const helmet  = require('helmet')
const compression = require('compression')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require('./database/init.mongodb')
// const { countConnection, checkOverload } = require('./helpers/check.connect')
// countConnection()
// checkOverload()
// init routes
app.use('/', require('./routes'))

// handling errors
app.use((req, res, next) => {
  console.log(123)
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack,
    message: error.message || 'Internal Server Error'
  })
})
  

module.exports = app
