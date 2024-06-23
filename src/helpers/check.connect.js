'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000

// count connect
const countConnection = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    
    // Example maximum number of connections on number of cores
    const maxConnection = numCores * 5

    console.log('🚀 ~ Active connections:', numConnection)
    console.log('🚀 ~ memoryUsage:', memoryUsage / 1024 / 1024, 'MB')

    if (numConnection > maxConnection) {
      console.log('Connection overload detected!')
    }
  }, _SECOND) // Monitoring every 5 seconds
}

module.exports = {
  countConnection,
  checkOverload
}