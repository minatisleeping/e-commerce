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

module.exports = app
