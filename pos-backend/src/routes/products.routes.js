const express = require('express')
const router = express.Router()
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getProducts)
router.post('/', verifyToken, createProduct)
router.put('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)

module.exports = router