'use strict'
const { StatusCodes } = require('http-status-codes')

const ReasonStatusCode = {
  CREATED: 'Created ^_^',
  OK: 'Success ^_^',
}

class SuccessResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReassonStatusCode.OK, metaData = {} }) {
    this.message = message ? message : reasonStatusCode
    this.statusCode = statusCode
    this.metaData = metaData
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metaData }) {
    super({ message, metaData })
  }
}

class CREATED extends SuccessResponse {
  constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metaData }) {
    super({ message, statusCode, reasonStatusCode, metaData })
    this.options = options
  }
}

module.exports = {
  OK, CREATED, SuccessResponse
}
