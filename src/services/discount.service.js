'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const { discount } = require('../models/discount.model')
const { findAllDiscountCodesSelect, findAllDiscountCodesUnSelect } = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectId } = require('../utils')


/**
 ** Discount Service
 * 1 - Generate discount code [Shop | Admin]
 * 2 - Get discount amount    [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code   [User]
 * 5 - Delete discount code   [Shop | Admin]
 * 6 - Cancel discount code   [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active,
      shopId, min_order_value, product_ids, applies_to, name, description,
      type, value, max_value, max_uses, uses_count, max_uses_per_user
    } = payload

    // validate
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!')
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be less than end date!')
    }

    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code already exists!')
    }

    return await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all'? [] : product_ids
    })
  }

  static async updateDiscountCode() {}

  //* Get all discount codes available with products
  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount code not found!')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let filter
    if (discount_applies_to === 'all') {
      // get all products
      filter = { product_shop: convertToObjectId(shopId), isPublished: true }
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = { _id: { $in: discount_product_ids }, isPublished: true }
    }

    return await findAllProducts({
        filter,
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
    })
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount
    })

    return discounts
  }
}
