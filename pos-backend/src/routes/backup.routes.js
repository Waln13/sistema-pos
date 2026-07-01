const express = require('express')
const router = express.Router()
const { getBackupData } = require('../controllers/backup.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getBackupData)

module.exports = router