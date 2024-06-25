'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { StatusCodes } = require('http-status-codes')
const { STATUS_CODES } = require('http')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRIT',
  EDITOR: 'EDIT',
  ADMIN: 'ADMIN'
}
class AccessService {
  static signUp = async ({name, email, password}) => {
    try {
        // step1: Check email exists?
        const holderShop = await shopModel.findOne({email}).lean()
        if (holderShop) {
          return {
            code: 'xxxx',
            message: 'Shop already registered'
          }
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
          name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
          // create private key, public key
          const { publicKey, privateKey, } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
          })
          console.log(privateKey, '---', publicKey)

          const publicKeyString = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey: publicKey.toString(),
            privateKey: privateKey.toString(),
          })

          if (!publicKeyString) {
            return {
              code: 'xxx',
              message: 'publicKeyString error'
            }
          }
          console.log('publicKeyString:: ', publicKeyString)

          // create pub
          const publicKeyObject  = await crypto.createPublicKey(publicKeyString)
          console.log('publicKeyObject:: ', publicKeyObject)

          // created token pair
          const tokens = await createTokenPair(
            { userId: newShop._id, email },
            publicKeyObject,
            privateKey
          )

          console.log('Created token success:: ', tokens)

          return {
            code: StatusCodes.CREATED,
            metaData: {
              shop: getInfoData({ object: newShop, fields: ['_id', 'name', 'email'] }),
              tokens
            }
          }
        }

        return {
          code: StatusCodes.OK,
          metaData: null
        }
    } catch(error) {
        console.error(`signUp:: `, error)
        return {
            code: '',
            message: error.message,
            status: 'error'
        }
    }
  }
}

module.exports = AccessService
