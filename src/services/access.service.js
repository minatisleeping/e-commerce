'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRIT',
  EDITOR: 'EDIT',
  ADMIN: 'ADMIN'
}
class AccessService {
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened! Please login again!')
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!')

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered!')

    // create pair token
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

    //update token
    await keyStore.update({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken }
    })

    return { user, tokens }
  }

  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    if (foundToken) {
      // decode
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log('🚀 ~ userId, email:', userId, email)
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened! Please login again!')
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered! 1')

    //verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    console.log('🚀 ~ userId, email:', userId, email)
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered! 2')

    // create pair token
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    //update token
    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  /**
   ** 1 - Check email in db
   ** 2 - Match password
   ** 3 - Create token pair and save to db
   ** 4 - Generate tokens
   ** 5 - Get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop isn\'t registered')

    // 2.
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    // 3. Create private key, public key
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    })

    // 4. generate tokens
    const { _id: userId } = foundShop
    const tokens =  await createTokenPair({
      userId: userId.toString(), email
    }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId: userId.toString(),
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    })

    return {
      shop: getInfoData({ object: foundShop, fields: ['_id', 'name', 'email'] }),
      tokens
    }
  }

  static signUp = async ({name, email, password}) => {
    const holderShop = await shopModel.findOne({email}).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!', StatusCodes.BAD_REQUEST)
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
  }
}

module.exports = AccessService
