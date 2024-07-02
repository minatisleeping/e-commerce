'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authentication, authenticationV2 } = require('../../auth/authUtils')


// signUp
router.post('/shop/sign-up', wrapAsync(accessController.signUp))
router.post('/shop/login', wrapAsync(accessController.login))

// authentication
router.use(authenticationV2)

//logout
router.post('/shop/logout', wrapAsync(accessController.logout))
router.post('/shop/handlerRefreshToken', wrapAsync(accessController.handlerRefreshTokenV2))

module.exports = router
