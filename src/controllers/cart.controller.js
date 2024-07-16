'use strict'

const CartService = require('../services/cart.service')
const { StatusCodes } = require('http-status-codes')

class CartController {
  addToCart = async (req, res, next) => {
    const result = await CartService.addToCart(req.body)
    console.log('🚀 ~ result:', result)

    return res.status(StatusCodes.OK).json({
      message: 'Add to cart successful!',
      metaData: result
    })
  }

  update = async (req, res, next) => {
    const result = await CartService.addToCartV2(req.body)

    return res.status(StatusCodes.OK).json({
      message: 'Add to cart successful!',
      metaData: result
    })
  }

  delete = async (req, res, next) => {
    const result = await CartService.deleteUserCart(req.body)

    return res.status(StatusCodes.OK).json({
      message: 'Delete this item from cart successful!',
      metaData: result
    })
  }

  list = async (req, res, next) => {
    const result = await CartService.getListUserCart(req.query)

    return res.status(StatusCodes.OK).json({
      message: 'Get cart successful!',
      metaData: result
    })
  }
}

module.exports = new CartController()
