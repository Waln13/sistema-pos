const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) 
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' })

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'CAJERO' },
      select: { id: true, name: true, email: true, role: true }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, password } = req.body

    const data = { name, email, role }
    if (password) data.password = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: { id: true, name: true, email: true, role: true }
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (parseInt(id) === req.user.id)
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' })

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { active: false }
    })
    res.json({ message: 'Usuario desactivado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser }