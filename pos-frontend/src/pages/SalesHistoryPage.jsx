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
                <div key={sale.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div
                    className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpand(sale.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">#{sale.id}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {sale.items.length} producto(s) — por {sale.user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sale.createdAt).toLocaleString('es-DO')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-green-600">
                        RD$ {sale.total.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">
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
                            <td className="pt-2 font-bold text-green-600">RD$ {sale.total.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginación */}
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