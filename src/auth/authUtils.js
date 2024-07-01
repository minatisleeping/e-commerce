'use strict'

const JWT = require('jsonwebtoken')
const { wrapAsync } = require('../helpers/wrapAsync')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const createTokenPair = async ( payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256', expiresIn: '1 days'
    })

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256', expiresIn: '2 days'
    })

    // verify key
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify:: `, err)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error(`createTokenPair error:: `, error)
  }
}

const authentication = wrapAsync(async (req, res, next) => {
  /**
   ** 1 - Check userId missing ?
   ** 2 - Get accessToken
   ** 3 - Verify token
   ** 4 - Check user in db
   ** 5 - Check keyStore with this userId
   ** 6 - OK all -> return next()
  */
  //1
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request!')

  //2
  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore!')

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Authentication error!')

  //4
  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decoded.userId) throw new AuthFailureError('Invalid userId!')
    req.keyStore = keyStore

    return next()
  } catch (error) { throw error }
})

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = { createTokenPair, authentication, verifyJWT }
