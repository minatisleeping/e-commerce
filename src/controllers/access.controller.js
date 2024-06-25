'use strict'

const AccessService = require('../services/access.service')

class AccessController {
  signUp = async (req, res, next) => {
    try {
      // const result = await accessService.signUp(req.body)
      
      // console.log('🚀 ~ result:', result)
      // return res.status(201).json(result)

      return res.status(201).json(await AccessService.signUp(req.body))
    } catch (error) { next(error) }
  }
}

module.exports = new AccessController()
