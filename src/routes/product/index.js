'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)

//logout
router.post('', wrapAsync(ProductController.createProductV2))

//query
router.get('/drafts/all', wrapAsync(ProductController.getAllDraftsForShop))

module.exports = router
