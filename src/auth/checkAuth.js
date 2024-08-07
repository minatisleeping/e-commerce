'use strict'

const { StatusCodes } = require('http-status-codes')
const { findById } = require('../services/apikey.service')


const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden err!' })
    }

    // check objKey
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden err!' })
    }

    req.objKey = objKey
    return next()
  } catch (error) {}
}

const permission = ( permissions ) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Permission denied!' })
    }
    console.log('🚀 ~ permissions:', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permissions)

    if (!validPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Permission denied!' })
    }

    return next()
  }
}

module.exports = { apiKey, permission }
