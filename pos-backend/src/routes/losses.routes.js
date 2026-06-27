const express = require('express')
const router = express.Router()
const { getLosses, createLoss, getReturns, createReturn } = require('../controllers/losses.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/losses', verifyToken, getLosses)
router.post('/losses', verifyToken, createLoss)
router.get('/returns', verifyToken, getReturns)
router.post('/returns', verifyToken, createReturn)

module.exports = router