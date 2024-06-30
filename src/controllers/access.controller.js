'use strict'
const AccessService = require('../services/access.service')
const { StatusCodes } = require('http-status-codes')
class AccessController {
  signUp = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json(await AccessService.signUp(req.body))
  }
}

module.exports = new AccessController()
