'use strict'

const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { StatusCodes } = require('http-status-codes')

class ProductController {
  createProduct = async (req, res, next) => {
    const result = await ProductService.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Create new Product success!',
      metaData: result
    })
  }

  createProductV2 = async (req, res, next) => {
    const result = await ProductServiceV2.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Create new Product success!',
      metaData: result
    })
  }
}

module.exports = new ProductController()
