const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/products.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'POS API corriendo' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

const salesRoutes = require('./src/routes/sales.routes')
// después de las otras rutas:
app.use('/api/sales', salesRoutes)

const reportsRoutes = require('./src/routes/reports.routes')
app.use('/api/reports', reportsRoutes)

const usersRoutes = require('./src/routes/users.routes')
app.use('/api/users', usersRoutes)

const lossesRoutes = require('./src/routes/losses.routes')
app.use('/api/inventory', lossesRoutes)

const suppliersRoutes = require('./src/routes/suppliers.routes')
app.use('/api/suppliers', suppliersRoutes)

const lotsRoutes = require('./src/routes/lots.routes')
app.use('/api/lots', lotsRoutes)