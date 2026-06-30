const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getLots = async (req, res) => {
  try {
    const lots = await prisma.productLot.findMany({
      include: {
        product: { select: { name: true, category: true } },
        user: { select: { name: true } },
        supplier: { select: { name: true } }
      },
      orderBy: { expiresAt: 'asc' }
    })
    res.json(lots)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lotes', error: error.message })
  }
}

const getExpiringLots = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const lots = await prisma.productLot.findMany({
      where: {
        expiresAt: {
          not: null,
          lte: thirtyDaysFromNow
        },
        remaining: { gt: 0 }
      },
      include: {
        product: { select: { name: true, category: true } },
        supplier: { select: { name: true } }
      },
      orderBy: { expiresAt: 'asc' }
    })
    res.json(lots)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lotes próximos a vencer', error: error.message })
  }
}

const createLot = async (req, res) => {
  try {
    const { productId, quantity, expiresAt, supplierId, costPerUnit } = req.body
    const userId = req.user.id

    if (!productId || !quantity) 
      return res.status(400).json({ message: 'Producto y cantidad son requeridos' })

    const lot = await prisma.$transaction(async (tx) => {
      const newLot = await tx.productLot.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          remaining: parseInt(quantity),
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          supplierId: supplierId ? parseInt(supplierId) : null,
          costPerUnit: parseFloat(costPerUnit) || 0,
          userId
        },
        include: {
          product: { select: { name: true } },
          supplier: { select: { name: true } }
        }
      })

      // Sumar stock al producto
      await tx.product.update({
        where: { id: parseInt(productId) },
        data: { stock: { increment: parseInt(quantity) } }
      })

      return newLot
    })

    res.status(201).json(lot)
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar lote', error: error.message })
  }
}

module.exports = { getLots, getExpiringLots, createLot }