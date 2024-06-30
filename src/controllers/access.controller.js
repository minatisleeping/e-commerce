'use strict'

const AccessService = require('../services/access.service')
const { StatusCodes } = require('http-status-codes')

class AccessController {
  logout = async (req, res, next) => {
    const result = await AccessService.logout(req.keyStore)
    return res.status(StatusCodes.OK).json({
      message: 'Logout success!',
      result
    })
  }

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
