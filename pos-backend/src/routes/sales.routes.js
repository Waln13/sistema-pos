const express = require('express')
const router = express.Router()
const { createSale, getSales } = require('../controllers/sales.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getSales)
router.post('/', verifyToken, createSale)

module.exports = router