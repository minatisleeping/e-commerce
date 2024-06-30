'use strict'

const { StatusCodes } = require('http-status-codes')

const ReasonStatusCode = {
  FORBIDDEN: 'Bad Request Error',
  CONFLICT: 'Conflict Request Error'
}

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError 
}
