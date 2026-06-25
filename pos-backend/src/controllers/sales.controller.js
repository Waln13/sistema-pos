const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 20, date } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = date ? {
      createdAt: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`)
      }
    } : {}

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          user: { select: { name: true } },
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.sale.count({ where })
    ])

    res.json({ sales, total, pages: Math.ceil(total / parseInt(limit)), currentPage: parseInt(page) })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message })
  }
}

const createSale = async (req, res) => {
  try {
    const { items } = req.body
    const userId = req.user.id

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'La venta debe tener al menos un producto' })

    // Verificar stock disponible
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return res.status(404).json({ message: `Producto no encontrado` })
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` })
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    // Crear venta y descontar stock en una transacción
    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          total,
          userId,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        },
        include: {
          items: { include: { product: true } }
        }
      })

      // Descontar stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      return newSale
    })

    res.status(201).json(sale)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear venta', error: error.message })
  }
}

const cancelSale = async (req, res) => {
  try {
    const { id } = req.params

    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: { items: true }
    })

    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' })
    if (sale.cancelled) return res.status(400).json({ message: 'Esta venta ya fue anulada' })

    await prisma.$transaction(async (tx) => {
      // Marcar venta como anulada
      await tx.sale.update({
        where: { id: parseInt(id) },
        data: { cancelled: true }
      })

      // Devolver stock
      for (const item of sale.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      }
    })

    res.json({ message: 'Venta anulada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al anular venta', error: error.message })
  }
}

module.exports = { getSales, createSale, cancelSale }