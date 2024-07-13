const DiscountService = require('../services/discount.service')
const { StatusCodes } = require('http-status-codes')
const { getInfoData } = require('../utils')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    const result = await DiscountService.createDiscountCode({
      ...req.body,
      shopId: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Generate Code Successful!',
      metaData: result
    })
  }

  getAllDiscountCodes = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesByShop({
      ...req.query,
      shopId: req.user.userId
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get all discount codes successful!',
      metaData: result
    })
  }

  getDiscountAmount = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesByShop({
      ...req.body
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get discount amount successful!',
      metaData: result
    })
  }

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesWithProduct({
      ...req.query
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get all discount codes with products successful!',
      metaData: result
    })
  }
}

module.exports = new DiscountController()
