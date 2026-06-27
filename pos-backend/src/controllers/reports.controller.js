const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getSummary = async (req, res) => {
  try {
    const totalSales = await prisma.sale.count({ where: { cancelled: false } })
    const totalRevenue = await prisma.sale.aggregate({
      where: { cancelled: false },
      _sum: { total: true }
    })
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
      where: { cancelled: false },
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
      where: {
        sale: { cancelled: false }
      },
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

const getProfitReport = async (req, res) => {
  try {
    const sales = await prisma.saleItem.findMany({
      where: {
        sale: { cancelled: false }
      },
      include: {
        product: { select: { name: true, cost: true } }
      }
    })

    const losses = await prisma.productLoss.findMany({
      include: {
        product: { select: { name: true, cost: true } }
      }
    })

    // Calcular ingresos y costos por producto
    const productMap = {}

    sales.forEach(item => {
      const key = item.product.name
      if (!productMap[key]) {
        productMap[key] = { name: key, revenue: 0, cost: 0, units: 0 }
      }
      productMap[key].revenue += item.unitPrice * item.quantity
      productMap[key].cost += item.product.cost * item.quantity
      productMap[key].units += item.quantity
    })

    const products = Object.values(productMap).map(p => ({
      ...p,
      profit: p.revenue - p.cost,
      margin: p.revenue > 0 ? ((p.revenue - p.cost) / p.revenue * 100).toFixed(1) : 0
    }))

    // Calcular pérdidas en costo
    const totalLossCost = losses.reduce((sum, l) => sum + (l.product.cost * l.quantity), 0)

    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
    const totalCost = products.reduce((sum, p) => sum + p.cost, 0)
    const grossProfit = totalRevenue - totalCost
    const netProfit = grossProfit - totalLossCost

    res.json({
      totalRevenue,
      totalCost,
      grossProfit,
      totalLossCost,
      netProfit,
      products: products.sort((a, b) => b.profit - a.profit)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reporte de ganancias', error: error.message })
  }
}

module.exports = { getSummary, getSalesByDay, getTopProducts, getLowStockProducts, getProfitReport }