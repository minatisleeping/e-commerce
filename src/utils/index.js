'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectId = id => Types.ObjectId(id)

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

// removeUndefinedObject({ a: 1, b: undefined }) => { a: 1 }
const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null) delete obj[key]
  })

  return obj
}

const updateNestedObjectParser = (obj, parent, result = {}) => {
  Object.keys(obj).forEach(k => {
    const propName = parent ? `${parent}.${k}` : k
    if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
      updateNestedObjectParser(obj[k], propName, result)
    } else {
      result[propName] = obj[k]
    }
  })

  return result
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectId
}
