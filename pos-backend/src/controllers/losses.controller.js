const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getLosses = async (req, res) => {
  try {
    const losses = await prisma.productLoss.findMany({
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(losses)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pérdidas', error: error.message })
  }
}

const createLoss = async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body
    const userId = req.user.id

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    if (product.stock < quantity) return res.status(400).json({ message: 'Stock insuficiente' })

    const loss = await prisma.$transaction(async (tx) => {
      const newLoss = await tx.productLoss.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          reason,
          notes,
          userId
        },
        include: {
          product: { select: { name: true } },
          user: { select: { name: true } }
        }
      })

      await tx.product.update({
        where: { id: parseInt(productId) },
        data: { stock: { decrement: parseInt(quantity) } }
      })

      return newLoss
    })

    res.status(201).json(loss)
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar pérdida', error: error.message })
  }
}

const getReturns = async (req, res) => {
  try {
    const returns = await prisma.productReturn.findMany({
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(returns)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener devoluciones', error: error.message })
  }
}

const createReturn = async (req, res) => {
  try {
    const { productId, quantity, reason, notes, supplier } = req.body
    const userId = req.user.id

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    if (product.stock < quantity) return res.status(400).json({ message: 'Stock insuficiente' })

    const productReturn = await prisma.$transaction(async (tx) => {
      const newReturn = await tx.productReturn.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          reason,
          notes,
          supplier,
          userId
        },
        include: {
          product: { select: { name: true } },
          user: { select: { name: true } }
        }
      })

      await tx.product.update({
        where: { id: parseInt(productId) },
        data: { stock: { decrement: parseInt(quantity) } }
      })

      return newReturn
    })

    res.status(201).json(productReturn)
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar devolución', error: error.message })
  }
}

module.exports = { getLosses, createLoss, getReturns, createReturn }