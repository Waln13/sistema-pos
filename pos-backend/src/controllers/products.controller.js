const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message })
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body
    if (!name || !price) return res.status(400).json({ message: 'Nombre y precio son requeridos' })

    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock) || 0, category }
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, stock, category } = req.body

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price: parseFloat(price), stock: parseInt(stock), category }
    })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { active: false }
    })
    res.json({ message: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message })
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }