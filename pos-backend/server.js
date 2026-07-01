const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/products.routes')
const salesRoutes = require('./src/routes/sales.routes')
const reportsRoutes = require('./src/routes/reports.routes')
const usersRoutes = require('./src/routes/users.routes')
const lossesRoutes = require('./src/routes/losses.routes')
const suppliersRoutes = require('./src/routes/suppliers.routes')
const lotsRoutes = require('./src/routes/lots.routes')
const backupRoutes = require('./src/routes/backup.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/inventory', lossesRoutes)
app.use('/api/suppliers', suppliersRoutes)
app.use('/api/lots', lotsRoutes)
app.use('/api/backup', backupRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'POS API corriendo' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})