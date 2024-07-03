'use strict'

const ProductService = require('../services/product.service')
const { StatusCodes } = require('http-status-codes')

class ProductController {
  createProduct = async (req, res, next) => {
    const result = await ProductService.createProduct(req.body.product_type, req.body)
    return res.status(StatusCodes.OK).json({
      message: 'Create new Product success!',
      metaData: result
    })
  }
}

module.exports = new ProductController()
