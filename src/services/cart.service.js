'use strict'

const { cart } = require('../models/cart.model')

/**
 ** Key feature: Cart Service
 * - Add product to cart              - [User]
 * - Reduce product quantity by one   - [User]
 * - Increase product quantity by one - [User]
 * - Get cart                         - [User]
 * - Delete cart                      - [User]
 * - Delete cart item                 - [User]
 */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' }
    updateOrInsert = {
      $addToSet: { cart_products: product }
    }, options = { upsert: true, new: true }

    return await cart.findByIdAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId, // find product in cart
      cart_state: 'active'
    }, updateSet = { $inc: { 'cart_products.$.quantity': quantity }
    }, options   = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product = {} }) {
    // check cart có tồn tại không ?
    const userCart = await cart.findOne({ cart_userId: userId })

    if (!userCart) {
      // create cart for User

      return await this.createUserCart({ userId, product })
    }

    // check product có tồn tại trong cart không ?
    if (userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // if cart already have this product then increase quantity
    return await this.updateUserCartQuantity({ userId, product })
  }

  // update product quantity in cart
}

module.exports = CartService