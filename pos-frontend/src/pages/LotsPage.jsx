import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function LotsPage() {
  const [lots, setLots] = useState([])
  const [expiringLots, setExpiringLots] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('all')
  const [form, setForm] = useState({
    productId: '',
    quantity: '',
    expiresAt: '',
    supplierId: '',
    costPerUnit: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [l, e, p, s] = await Promise.all([
        api.get('/lots'),
        api.get('/lots/expiring'),
        api.get('/products'),
        api.get('/suppliers')
      ])
      setLots(l.data)
      setExpiringLots(e.data)
      setProducts(p.data)
      setSuppliers(s.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/lots', form)
      setForm({ productId: '', quantity: '', expiresAt: '', supplierId: '', costPerUnit: '' })
      setShowForm(false)
      fetchAll()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar lote')
    }
  }

  const getDaysUntilExpiry = (expiresAt) => {
    if (!expiresAt) return null
    const today = new Date()
    const expiry = new Date(expiresAt)
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getExpiryBadge = (expiresAt) => {
    if (!expiresAt) return null
    const days = getDaysUntilExpiry(expiresAt)
    if (days < 0) return { label: '🚫 Vencido', class: 'bg-red-100 text-red-700' }
    if (days <= 7) return { label: `🔴 Vence en ${days} días`, class: 'bg-red-100 text-red-700' }
    if (days <= 30) return { label: `🟠 Vence en ${days} días`, class: 'bg-orange-100 text-orange-700' }
    return { label: `✅ Vence en ${days} días`, class: 'bg-green-100 text-green-700' }
  }

  const displayLots = tab === 'expiring' ? expiringLots : lots

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Control de Lotes</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        {/* Alerta si hay lotes próximos a vencer */}
        {expiringLots.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-orange-700 font-medium text-sm">
                {expiringLots.length} lote(s) próximos a vencer en los próximos 30 días
              </p>
              <p className="text-orange-500 text-xs mt-0.5">
                Revisa la pestaña "Próximos a vencer" para más detalles
              </p>
            </div>
            <button
              onClick={() => setTab('expiring')}
              className="ml-auto text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              Ver ahora
            </button>
          </div>
        )}

        {/* Tabs y botón */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400'}`}
          >
            📦 Todos los lotes ({lots.length})
          </button>
          <button
            onClick={() => setTab('expiring')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'expiring' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-orange-400'}`}
          >
            ⚠️ Próximos a vencer ({expiringLots.length})
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + Registrar lote
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-4">📦 Registrar nuevo lote</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Producto</label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Cantidad recibida</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                  min="1"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Fecha de vencimiento</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Costo por unidad (RD$)</label>
                <input
                  type="number"
                  value={form.costPerUnit}
                  onChange={e => setForm({ ...form, costPerUnit: e.target.value })}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Proveedor (opcional)</label>
                <select
                  value={form.supplierId}
                  onChange={e => setForm({ ...form, supplierId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin proveedor</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Registrar lote
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando lotes...</p>
        ) : displayLots.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay lotes registrados.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Cantidad</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Restante</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Costo unit.</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Proveedor</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Vencimiento</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {displayLots.map(lot => {
                  const badge = getExpiryBadge(lot.expiresAt)
                  return (
                    <tr key={lot.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {lot.product.name}
                        {lot.product.category && (
                          <span className="text-xs text-gray-400 ml-1">({lot.product.category})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lot.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${lot.remaining === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                          {lot.remaining}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {lot.costPerUnit > 0 ? `RD$ ${lot.costPerUnit.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {lot.supplier?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {lot.expiresAt ? (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              {new Date(lot.expiresAt).toLocaleDateString('es-DO')}
                            </p>
                            {badge && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
                                {badge.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Sin fecha</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(lot.createdAt).toLocaleDateString('es-DO')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}