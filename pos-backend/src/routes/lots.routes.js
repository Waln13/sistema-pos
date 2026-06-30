const express = require('express')
const router = express.Router()
const { getLots, getExpiringLots, createLot } = require('../controllers/lots.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getLots)
router.get('/expiring', verifyToken, getExpiringLots)
router.post('/', verifyToken, createLot)

module.exports = router