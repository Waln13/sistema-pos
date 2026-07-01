const express = require('express')
const router = express.Router()
const { getSummary, getSalesByDay, getTopProducts, getLowStockProducts, getProfitReport, getWeeklyComparison } = require('../controllers/reports.controller')
const { verifyToken } = require('../middlewares/auth.middleware')


router.get('/summary', verifyToken, getSummary)
router.get('/by-day', verifyToken, getSalesByDay)
router.get('/top-products', verifyToken, getTopProducts)
router.get('/low-stock', verifyToken, getLowStockProducts)
router.get('/profit', verifyToken, getProfitReport)
router.get('/weekly', verifyToken, getWeeklyComparison)

module.exports = router