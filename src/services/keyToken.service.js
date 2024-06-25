'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString()
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString
        // ,privateKey
      })

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokenService