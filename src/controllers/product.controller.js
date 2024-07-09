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

  publishProductByShop = async (req, res, next) => {
    const result = await ProductServiceV2.publishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id
    })

    return res.status(StatusCodes.OK).json({
      message: 'Publish Product success',
      metaData: result
    })
  }

  unPublishProductByShop = async (req, res, next) => {
    const result = await ProductServiceV2.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id
    })

    return res.status(StatusCodes.OK).json({
      message: 'un-publish Product success',
      metaData: result
    })
  }

  /**
   * @description: Get all publish for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllPublishForShop = async (req, res, next) => {
    const result = await ProductServiceV2.findAllPublishForShop({
      product_shop: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get all publish list success!',
      metaData: result
    })
  }

  /**
   * @description: Get all drafts for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    const result = await ProductServiceV2.findAllDraftsForShop({
      product_shop: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get all drafts list success!',
      metaData: result
    })
  }

  /**
   * @description: Get all drafts for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getListSearchProduct = async (req, res, next) => {
    const result = await ProductServiceV2.searchProducts(req.params)

    return res.status(StatusCodes.OK).json({
      message: 'Get list search product success!',
      metaData: result
    })
  }
}

module.exports = new ProductController()
