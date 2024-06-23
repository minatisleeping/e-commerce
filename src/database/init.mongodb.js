'use strict'
const mongoose = require('mongoose')
const { env } = require('../configs/environment')
const { countConnection } = require('../helpers/check.connect')

const connectString = `mongodb+srv://${env.USERNAME}:${env.PASSWORD}@${env.CLUSTER}`

class Database {
  constructor() {
    this._connect()
  }

  // connect
  _connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    
    mongoose.connect(connectString, { maxPoolSize: 50 })
    .then(_=> console.log('Connected to MongoDB successfully!', countConnection()))
    .catch(err => console.error('Error connecting to MongoDB: ', err))
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
