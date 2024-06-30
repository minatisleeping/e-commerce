'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { wrapAsync } = require('../../helpers/wrapAsync')
const { authentication } = require('../../auth/authUtils')


// signUp
router.post('/shop/sign-up', wrapAsync(accessController.signUp))
router.post('/shop/login', wrapAsync(accessController.login))

// authentication
router.use(authentication)

//logout
router.post('/shop/logout', wrapAsync(accessController.logout))

module.exports = router
