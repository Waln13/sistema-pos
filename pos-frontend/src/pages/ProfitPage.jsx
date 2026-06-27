import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function ProfitPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfit()
  }, [])

  const fetchProfit = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reports/profit')
      setData(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Ganancias</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Calculando ganancias...</p>
        ) : !data ? (
          <p className="text-gray-500 text-sm">No hay datos disponibles.</p>
        ) : (
          <>
            {/* Tarjetas resumen */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Ingresos totales</p>
                <p className="text-xl font-bold text-blue-600">RD$ {data.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Costo total</p>
                <p className="text-xl font-bold text-gray-600">RD$ {data.totalCost.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Ganancia bruta</p>
                <p className="text-xl font-bold text-green-600">RD$ {data.grossProfit.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Pérdidas (costo)</p>
                <p className="text-xl font-bold text-red-500">- RD$ {data.totalLossCost.toFixed(2)}</p>
              </div>
              <div className={`rounded-xl border p-5 ${data.netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-500 mb-1">Ganancia neta</p>
                <p className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  RD$ {data.netProfit.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Tabla por producto */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-700">Ganancia por producto</h2>
                <p className="text-xs text-gray-400 mt-1">Ordenado de mayor a menor ganancia</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Unidades</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Ingresos</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Costo</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Ganancia</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No hay ventas registradas aún
                      </td>
                    </tr>
                  ) : (
                    data.products.map((p, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{p.units}</td>
                        <td className="px-4 py-3 text-blue-600">RD$ {p.revenue.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-500">RD$ {p.cost.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${p.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            RD$ {p.profit.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.margin >= 30 ? 'bg-green-100 text-green-700' :
                            p.margin >= 15 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {p.margin}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}