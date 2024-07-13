'use strict'

const express = require('express')
const router = express.Router()
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')

// get amount a discount
router.post('/amount', wrapAsync(discountController.getDiscountAmount))
router.get('/list-product-code', wrapAsync(discountController.getAllDiscountCodesWithProducts))

// authentication
router.use(authenticationV2)

router.post('/', wrapAsync(discountController.createDiscountCode))
router.get('/', wrapAsync(discountController.getAllDiscountCodes))

module.exports = router
