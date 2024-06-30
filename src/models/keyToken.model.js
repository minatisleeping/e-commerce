'use strict'

const { Schema, model } = require('mongoose')


const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    trim: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    trim: true
  },
  privateKey: {
    type: String,
    trim: true
  },
  refreshToken: {
    type: Array,
    default: []
  }
},{
  timestamps: true,
  collection: COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, keyTokenSchema)