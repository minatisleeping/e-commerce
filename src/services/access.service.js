'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRIT',
  EDITOR: 'EDIT',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist
      const holderShop = await shopModel.findOne({ email }).lean()
      
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already register!'
        }
      }

      const passwordHashed = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHashed,
        roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        })

        // const privateKey = crypto.randomBytes(64).toString('hex')
        // const publicKey = crypto.randomBytes(64).toString('hex')
        console.log({ privateKey, publicKey })

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
          // ,privateKey
        })
        
        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'Error publicKey!'
          }
        }


        // const publicKeyObject = crypto.createPublicKey(publicKeyString)
        // console.log('🚀 ~ publicKeyObject:', publicKeyObject)
        
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        )
        console.log('🚀 ~ tokens:', tokens)
        
        return {
          code: 201,
          metadata: {
            shop: getInfoData({ object: newShop, fields: ['_id', 'name', 'email'] }),
            tokens
          }
        }
      }

      return {
        code: 201,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService

