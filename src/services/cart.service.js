'use strict'

const { NotFoundError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')

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
    const updateOrInsert = {
      $addToSet: { cart_products: product }
    }, options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
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

  // update cart
  /**
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

    // check product
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('Product not found!')

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product not found in this shop!')
    }

    if (quantity === 0) {
      //delete product from cart
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
    updateSet = { $pull: { cart_products: { productId } } }
    
    return await cart.updateOne(query, updateSet)
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean()
  }
}

module.exports = CartService
