'use strict'
const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const [accessToken, refreshToken] = await Promise.all([
      JWT.sign(payload, privateKey, { expiresIn: '2 days', algorithm: 'RS256' }),
      JWT.sign(payload, privateKey, { expiresIn: '7 days', algorithm: 'RS256' })
    ])
    console.log('🚀 ~ accessToken:', accessToken)
    console.log('🚀 ~ refreshToken:', refreshToken)

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw new Error('Invalid accessToken')
      } else {
        console.log('🚀 ~ decoded verify:', decoded)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) { console.log('🚀 ~ error:', error) }
}

module.exports = {
  createTokenPair
}
