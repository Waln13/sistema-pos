import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function LossesPage() {
  const [losses, setLosses] = useState([])
  const [returns, setReturns] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('losses')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ productId: '', quantity: '', reason: '', notes: '', supplier: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [l, r, p] = await Promise.all([
        api.get('/inventory/losses'),
        api.get('/inventory/returns'),
        api.get('/products')
      ])
      setLosses(l.data)
      setReturns(r.data)
      setProducts(p.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tab === 'losses') {
        await api.post('/inventory/losses', form)
      } else {
        await api.post('/inventory/returns', form)
      }
      setForm({ productId: '', quantity: '', reason: '', notes: '', supplier: '' })
      setShowForm(false)
      fetchAll()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar')
    }
  }

  const lossReasons = [
    { value: 'VENCIDO', label: '📅 Vencido' },
    { value: 'DANADO', label: '💥 Dañado en tienda' },
    { value: 'MERMA', label: '📉 Merma / desaparición' },
    { value: 'OTRO', label: '❓ Otro' }
  ]

  const returnReasons = [
    { value: 'VENCIDO', label: '📅 Vencido (acepta devolución)' },
    { value: 'DEFECTO_FABRICA', label: '🏭 Defecto de fábrica' },
    { value: 'MAL_ESTADO_LLEGADA', label: '📦 Mal estado al llegar' },
    { value: 'OTRO', label: '❓ Otro' }
  ]

  const totalLosses = losses.reduce((sum, l) => sum + (l.quantity * l.product?.price || 0), 0)
  const totalReturns = returns.reduce((sum, r) => sum + (r.quantity * r.product?.price || 0), 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Pérdidas y Devoluciones</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-red-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total pérdidas</p>
            <p className="text-2xl font-bold text-red-500">RD$ {totalLosses.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{losses.length} registro(s)</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total devoluciones a proveedor</p>
            <p className="text-2xl font-bold text-orange-500">RD$ {totalReturns.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{returns.length} registro(s)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setTab('losses'); setShowForm(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'losses' ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-red-400'}`}
          >
            🗑️ Pérdidas
          </button>
          <button
            onClick={() => { setTab('returns'); setShowForm(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'returns' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-orange-400'}`}
          >
            🔄 Devoluciones a proveedor
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={`ml-auto px-4 py-2 rounded-lg text-sm font-medium text-white transition ${tab === 'losses' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            + Registrar {tab === 'losses' ? 'pérdida' : 'devolución'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-4">
              {tab === 'losses' ? '🗑️ Registrar pérdida' : '🔄 Registrar devolución a proveedor'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Producto</label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Cantidad</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Motivo</label>
                <select
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecciona un motivo</option>
                  {(tab === 'losses' ? lossReasons : returnReasons).map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              {tab === 'returns' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Proveedor / Distribuidor</label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={e => setForm({ ...form, supplier: e.target.value })}
                    placeholder="Nombre del proveedor"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
              <div className="col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">Notas (opcional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Descripción adicional..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
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
                  className={`px-4 py-2 text-sm text-white rounded-lg ${tab === 'losses' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className={`border-b ${tab === 'losses' ? 'bg-red-50' : 'bg-orange-50'}`}>
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Cantidad</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Motivo</th>
                  {tab === 'returns' && <th className="text-left px-4 py-3 text-gray-600 font-medium">Proveedor</th>}
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Registrado por</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody>
                {(tab === 'losses' ? losses : returns).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No hay registros aún
                    </td>
                  </tr>
                ) : (
                  (tab === 'losses' ? losses : returns).map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{item.product.name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.quantity} unidades</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tab === 'losses' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.reason.replace('_', ' ')}
                        </span>
                      </td>
                      {tab === 'returns' && <td className="px-4 py-3 text-gray-500">{item.supplier || '—'}</td>}
                      <td className="px-4 py-3 text-gray-500">{item.user.name}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(item.createdAt).toLocaleDateString('es-DO')}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{item.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}