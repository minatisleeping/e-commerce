'use strict'
const { CREATED } = require('../core/success.response')
const AccessService = require('../services/access.service')
const { StatusCodes } = require('http-status-codes')
class AccessController {
  signUp = async (req, res, next) => {
    // new CREATED({
    //   message: 'Registered OK!',
    //   metaData: await AccessService.signUp(req.body)
    // }).send(res)

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
