const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getBackupData = async (req, res) => {
  try {
    const [products, sales, lots, losses, returns, suppliers] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      }),
      prisma.sale.findMany({
        include: {
          user: { select: { name: true } },
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productLot.findMany({
        include: {
          product: { select: { name: true } },
          supplier: { select: { name: true } },
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productLoss.findMany({
        include: {
          product: { select: { name: true } },
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productReturn.findMany({
        include: {
          product: { select: { name: true } },
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supplier.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      })
    ])

    res.json({ products, sales, lots, losses, returns, suppliers })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos de backup', error: error.message })
  }
}

module.exports = { getBackupData }