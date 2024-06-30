'use strict'
const { asyncHandler } = require('../auth/checkAuth')
const AccessService = require('../services/access.service')
const { StatusCodes } = require('http-status-codes')

class AccessController {
  login = async (req, res, next) => {
    const result = await AccessService.login(req.body)
    return res.status(StatusCodes.OK).json({
      message: 'Login success!',
      result
    })
  }

  signUp = async (req, res, next) => {
    const result = await AccessService.signUp(req.body)
    return res.status(StatusCodes.CREATED).json({
      message: 'Registered OK!',
      result,
      options: {
        limit: 10
      }
    })
  }
}

module.exports = new AccessController()
