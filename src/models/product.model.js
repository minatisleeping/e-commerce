'use strict'

const { Schema, model } = require('mongoose')
const slugify = require('../utils/slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
  product_name:        { type: String, required: true },
  product_thumb:       { type: String, required: true },
  product_description: { type: String },
  product_slug:        { type: String },
  product_price:       { type: Number, required: true },
  product_quantity:    { type: Number, required: true },
  product_type:        { type: String, required: true,
                          enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop:        { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes:  { type: Schema.Types.Mixed, required: true },
  //more
  product_ratingAvg: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    set: value => Math.round(value * 10) / 10 // 4.6666 => 46.666 => 47 => 4.7
  },
  product_variations: { type: Array, default: [], },
  isDraft: {
    type: Boolean,
    default: true, // ko được select ra
    index: true,
    select: false // ko lấy field này ra
  },
  isPublished: {
    type: Boolean,
    default: false, // ko được select ra
    index: true,
    select: false // ko lấy field này ra
  }
}, { collection: COLLECTION_NAME, timestamps: true })

// Document middleware: runs before .save() and .create()..
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name)
  next()
})

const clothingSchema = new Schema({
  brand:        { type: String, required: true },
  size:           String,
  material:       String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, { collection: 'Clothes', timestamps: true })

const electronicsSchema = new Schema({
  manufacturer: { type: String, required: true },
  model:          String,
  color:          String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, { collection: 'Electronics', timestamps: true })

const furnitureSchema  = new Schema({
  brand:        { type: String, required: true },
  size:           String,
  material:       String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, { collection: 'Furniture', timestamps: true })

module.exports = {
  product:    model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicsSchema),
  clothing:   model('Clothing',    clothingSchema),
  furniture:  model('Furniture',   furnitureSchema)
}
