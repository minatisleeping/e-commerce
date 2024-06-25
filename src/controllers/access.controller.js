'use strict'
const AccessService = require('../services/access.service')
const { StatusCodes } = require('http-status-codes')
class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(req.body)
      return res.status(StatusCodes.CREATED).json(await AccessService.signUp(req.body))
    } catch(error) { next(error) }
  }
}

module.exports = new AccessController()
