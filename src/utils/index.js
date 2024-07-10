'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

// getSelectData(['name', 'age']) => { name: 1, age: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 1]))
}

// getUnSelectData(['name', 'age']) => { name: 0, age: 0 }
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 0]))
}

module.exports = { getInfoData, getSelectData, getUnSelectData }
