'use strict'

const apikeyModel = require('../models/apikey.model')

const findById = async (key) => {
  return await apikeyModel.findOne({ key, status: true }).lean()
}

module.exports = { findById }
