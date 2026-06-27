const express = require('express')
const router = express.Router()
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/suppliers.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getSuppliers)
router.post('/', verifyToken, createSupplier)
router.put('/:id', verifyToken, updateSupplier)
router.delete('/:id', verifyToken, deleteSupplier)

module.exports = router