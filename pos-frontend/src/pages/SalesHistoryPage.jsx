import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [date, setDate] = useState('')
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSales()
  }, [currentPage, date])

  const fetchSales = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 })
      if (date) params.append('date', date)
      const res = await api.get(`/sales?${params}`)
      setSales(res.data.sales)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de que quieres anular esta venta? El stock se devolverá automáticamente.')) return
    try {
      await api.delete(`/sales/${id}`)
      fetchSales()
      alert('Venta anulada correctamente')
    } catch (error) {
      alert(error.response?.data?.message || 'Error al anular venta')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Historial de Ventas</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Historial de ventas</h2>
            <p className="text-sm text-gray-500">{total} venta(s) en total</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); setCurrentPage(1) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {date && (
              <button
                onClick={() => { setDate(''); setCurrentPage(1) }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando ventas...</p>
        ) : sales.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay ventas registradas.</p>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {sales.map(sale => (
                <div key={sale.id} className={`bg-white rounded-xl border overflow-hidden ${sale.cancelled ? 'border-red-200' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center px-5 py-4">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => toggleExpand(sale.id)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sale.cancelled ? 'bg-red-100' : 'bg-green-100'}`}>
                        <span className={`font-bold text-sm ${sale.cancelled ? 'text-red-500' : 'text-green-600'}`}>
                          #{sale.id}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          {sale.items.length} producto(s) — por {sale.user.name}
                          {sale.cancelled && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                              Anulada
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sale.createdAt).toLocaleString('es-DO')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${sale.cancelled ? 'text-red-400 line-through' : 'text-green-600'}`}>
                        RD$ {sale.total.toFixed(2)}
                      </span>
                      {!sale.cancelled && (
                        <button
                          onClick={() => handleCancel(sale.id)}
                          className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 rounded-lg transition"
                        >
                          Anular
                        </button>
                      )}
                      <span
                        className="text-gray-400 text-sm cursor-pointer"
                        onClick={() => toggleExpand(sale.id)}
                      >
                        {expanded === sale.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {expanded === sale.id && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 text-xs">
                            <th className="text-left pb-2">Producto</th>
                            <th className="text-left pb-2">Cantidad</th>
                            <th className="text-left pb-2">Precio unit.</th>
                            <th className="text-left pb-2">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map(item => (
                            <tr key={item.id} className="border-t border-gray-200">
                              <td className="py-2 text-gray-800">{item.product.name}</td>
                              <td className="py-2 text-gray-600">{item.quantity}</td>
                              <td className="py-2 text-gray-600">RD$ {item.unitPrice.toFixed(2)}</td>
                              <td className="py-2 font-medium text-gray-800">RD$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-300">
                            <td colSpan={3} className="pt-2 text-right font-semibold text-gray-700">Total:</td>
                            <td className={`pt-2 font-bold ${sale.cancelled ? 'text-red-400 line-through' : 'text-green-600'}`}>
                              RD$ {sale.total.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Página {currentPage} de {pages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
                  disabled={currentPage === pages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}