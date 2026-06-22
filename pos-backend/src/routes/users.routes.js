const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.get('/', verifyToken, getUsers)
router.post('/', verifyToken, createUser)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)

module.exports = router