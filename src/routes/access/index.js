'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')

// signUp
router.post('/shop/sign-up', accessController.signUp)

module.exports = router
