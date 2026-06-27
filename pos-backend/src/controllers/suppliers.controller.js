const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    })
    res.json(suppliers)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error: error.message })
  }
}

const createSupplier = async (req, res) => {
  try {
    const { name, phone, products } = req.body
    if (!name) return res.status(400).json({ message: 'El nombre es requerido' })

    const supplier = await prisma.supplier.create({
      data: { name, phone, products }
    })
    res.status(201).json(supplier)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proveedor', error: error.message })
  }
}

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, products } = req.body

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name, phone, products }
    })
    res.json(supplier)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message })
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { active: false }
    })
    res.json({ message: 'Proveedor eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message })
  }
}

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier }