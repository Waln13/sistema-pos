const express = require('express')
const router = express.Router()
const { getSales, createSale, cancelSale } = require('../controllers/sales.controller')
const { verifyToken } = require('../middlewares/auth.middleware')


router.get('/', verifyToken, getSales)
router.post('/', verifyToken, createSale)
router.delete('/:id', verifyToken, cancelSale)

module.exports = router