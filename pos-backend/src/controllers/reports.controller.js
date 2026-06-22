const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getSummary = async (req, res) => {
  try {
    const totalSales = await prisma.sale.count()
    const totalRevenue = await prisma.sale.aggregate({ _sum: { total: true } })
    const totalProducts = await prisma.product.count({ where: { active: true } })
    const lowStock = await prisma.product.count({ where: { active: true, stock: { lte: 5 } } })

    res.json({
      totalSales,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      lowStock
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen', error: error.message })
  }
}

const getSalesByDay = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'asc' },
      select: { total: true, createdAt: true }
    })

    const grouped = {}
    sales.forEach(sale => {
      const date = sale.createdAt.toISOString().split('T')[0]
      if (!grouped[date]) grouped[date] = 0
      grouped[date] += sale.total
    })

    const result = Object.entries(grouped).map(([date, total]) => ({ date, total }))
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por día', error: error.message })
  }
}

const getTopProducts = async (req, res) => {
  try {
    const items = await prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })

    const result = await Promise.all(items.map(async item => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      return { name: product.name, quantity: item._sum.quantity }
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener top productos', error: error.message })
  }
}

const getLowStockProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        stock: { lte: 10 }
      },
      orderBy: { stock: 'asc' },
      select: { id: true, name: true, stock: true, category: true }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener stock bajo', error: error.message })
  }
}

module.exports = { getSummary, getSalesByDay, getTopProducts, getLowStockProducts }