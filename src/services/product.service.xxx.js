'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require("../core/error.response")
const { findAllDraftsForShop } = require('../models/repositories/product.repo')

// define Factory class to create product
class ProductFactory {
  static productRegistry = {} // key-class

  static registerProduct(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).createProduct()
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }

    return await findAllDraftsForShop({ query, limit, skip })
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_type, product_shop, product_attributes, product_quantity
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }

  // create new Product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id })
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  // Create new Clothing
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) throw new BadRequestError('Create new Clothing error!')

    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new Product error!')

    return newProduct
  }
}

class Electronics extends Product {
  // Create new Electronics
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronics error!')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product error!')

    return newProduct
  }
}

class Furniture extends Product {
  // Create new Furniture
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new Furniture error!')

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new Product error!')

    return newProduct
  }
}

// register Product Types
ProductFactory.registerProduct('Electronics', Electronics)
ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Furniture', Furniture)

module.exports = ProductFactory
