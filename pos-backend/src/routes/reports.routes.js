const express = require('express')
const router = express.Router()
const { getSummary, getSalesByDay, getTopProducts, getLowStockProducts } = require('../controllers/reports.controller')
const { verifyToken } = require('../middlewares/auth.middleware')


router.get('/summary', verifyToken, getSummary)
router.get('/by-day', verifyToken, getSalesByDay)
router.get('/top-products', verifyToken, getTopProducts)
router.get('/low-stock', verifyToken, getLowStockProducts)

module.exports = router