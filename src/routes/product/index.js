'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authenticationV2 } = require('../../auth/authUtils')

router.get('/search/:keySearch', wrapAsync(ProductController.getListSearchProduct))
router.get('', wrapAsync(ProductController.findAllProducts))
router.get('/:product_id', wrapAsync(ProductController.findProduct))

// authentication
router.use(authenticationV2)

//logout
router.post('', wrapAsync(ProductController.createProductV2))
router.post('/publish/:id', wrapAsync(ProductController.publishProductByShop))
router.post('/unpublish/:id', wrapAsync(ProductController.unPublishProductByShop))

//query
router.get('/drafts/all', wrapAsync(ProductController.getAllDraftsForShop))
router.get('/published/all', wrapAsync(ProductController.getAllPublishForShop))

module.exports = router
