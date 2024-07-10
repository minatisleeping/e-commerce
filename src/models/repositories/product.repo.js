'use strict'

const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { Types } = require('mongoose')
const { getInfoData, getUnSelectData } = require('../../utils')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  return await product.find(
    { isPublished: true, $text: { $search: regexSearch } },
    { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .lean()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop)
  })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop)
  })

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  return await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getInfoData(select))
    .lean()
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ createdAt: -1 }) // descending
    .skip(skip)
    .limit(limit)
    .lean()
    // .exec() // optional: return a Promise - cụm từ đại diện cho dùng async/await
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct
}
