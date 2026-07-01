import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function BackupPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleBackup = async () => {
    setLoading(true)
    try {
      const res = await api.get('/backup')
      const { products, sales, lots, losses, returns, suppliers } = res.data

      const wb = XLSX.utils.book_new()

      // Hoja 1 — Productos
      const productsData = products.map(p => ({
        'ID': p.id,
        'Nombre': p.name,
        'Precio venta': p.price,
        'Precio costo': p.cost,
        'Stock': p.stock,
        'Categoría': p.category || '—',
        'Activo': p.active ? 'Sí' : 'No',
        'Creado': new Date(p.createdAt).toLocaleDateString('es-DO')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsData), 'Productos')

      // Hoja 2 — Ventas
      const salesData = sales.map(s => ({
        'ID': s.id,
        'Total': s.total,
        'Cajero': s.user.name,
        'Anulada': s.cancelled ? 'Sí' : 'No',
        'Fecha': new Date(s.createdAt).toLocaleDateString('es-DO'),
        'Productos': s.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), 'Ventas')

      // Hoja 3 — Lotes
      const lotsData = lots.map(l => ({
        'ID': l.id,
        'Producto': l.product.name,
        'Cantidad': l.quantity,
        'Restante': l.remaining,
        'Costo unit.': l.costPerUnit,
        'Proveedor': l.supplier?.name || '—',
        'Vencimiento': l.expiresAt ? new Date(l.expiresAt).toLocaleDateString('es-DO') : '—',
        'Registrado por': l.user.name,
        'Fecha': new Date(l.createdAt).toLocaleDateString('es-DO')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lotsData), 'Lotes')

      // Hoja 4 — Pérdidas
      const lossesData = losses.map(l => ({
        'ID': l.id,
        'Producto': l.product.name,
        'Cantidad': l.quantity,
        'Motivo': l.reason,
        'Notas': l.notes || '—',
        'Registrado por': l.user.name,
        'Fecha': new Date(l.createdAt).toLocaleDateString('es-DO')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lossesData), 'Pérdidas')

      // Hoja 5 — Devoluciones
      const returnsData = returns.map(r => ({
        'ID': r.id,
        'Producto': r.product.name,
        'Cantidad': r.quantity,
        'Motivo': r.reason,
        'Proveedor': r.supplier || '—',
        'Notas': r.notes || '—',
        'Registrado por': r.user.name,
        'Fecha': new Date(r.createdAt).toLocaleDateString('es-DO')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(returnsData), 'Devoluciones')

      // Hoja 6 — Proveedores
      const suppliersData = suppliers.map(s => ({
        'ID': s.id,
        'Nombre': s.name,
        'Teléfono': s.phone || '—',
        'Productos': s.products || '—',
        'Registrado': new Date(s.createdAt).toLocaleDateString('es-DO')
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(suppliersData), 'Proveedores')

      // Exportar
      const date = new Date().toISOString().split('T')[0]
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `backup-pos-${date}.xlsx`)

    } catch (error) {
      alert('Error al generar el backup')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Backup</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Exportar backup completo</h2>
          <p className="text-gray-500 text-sm mb-6">
            Descarga un archivo Excel con todos los datos del sistema — productos, ventas, lotes, pérdidas, devoluciones y proveedores.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { icon: '📦', label: 'Productos e inventario' },
              { icon: '🛒', label: 'Historial de ventas' },
              { icon: '📋', label: 'Control de lotes' },
              { icon: '🗑️', label: 'Pérdidas registradas' },
              { icon: '🔄', label: 'Devoluciones a proveedor' },
              { icon: '🤝', label: 'Proveedores' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span>{item.icon}</span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleBackup}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 text-sm"
          >
            {loading ? '⏳ Generando backup...' : '📥 Descargar backup Excel'}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Se descargará como: backup-pos-{new Date().toISOString().split('T')[0]}.xlsx
          </p>
        </div>
      </div>
    </div>
  )
}