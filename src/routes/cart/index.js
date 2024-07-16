'use strict'

const express = require('express')
const router = express.Router()
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')

router.post('', wrapAsync(cartController.addToCart))
router.delete('', wrapAsync(cartController.delete))
router.post('/update', wrapAsync(cartController.update))
router.get('', wrapAsync(cartController.list))

// authentication
router.use(authenticationV2)

module.exports = router
