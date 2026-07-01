import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

export default function WeeklyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWeekly()
  }, [])

  const fetchWeekly = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reports/weekly')
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
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Comparativa Semanal</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando comparativa...</p>
        ) : !data ? (
          <p className="text-gray-500 text-sm">No hay datos disponibles.</p>
        ) : (
          <>
            {/* Tarjetas resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Esta semana</p>
                <p className="text-2xl font-bold text-blue-600">RD$ {data.thisWeekTotal.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{data.thisWeekCount} venta(s)</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Semana pasada</p>
                <p className="text-2xl font-bold text-gray-600">RD$ {data.lastWeekTotal.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{data.lastWeekCount} venta(s)</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Diferencia</p>
                <p className={`text-2xl font-bold ${data.difference >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {data.difference >= 0 ? '+' : ''}RD$ {data.difference.toFixed(2)}
                </p>
              </div>
              <div className={`rounded-xl border p-5 ${data.percentChange >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-500 mb-1">Variación</p>
                <p className={`text-2xl font-bold ${data.percentChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {data.percentChange >= 0 ? '📈' : '📉'} {data.percentChange}%
                </p>
                <p className="text-xs text-gray-400 mt-1">vs semana anterior</p>
              </div>
            </div>

            {/* Gráfica comparativa */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-700 mb-1">Ventas por día</h2>
              <p className="text-xs text-gray-400 mb-4">Esta semana vs semana pasada</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.comparison} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => `RD$ ${val.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="lastWeek" name="Semana pasada" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="thisWeek" name="Esta semana" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla detalle */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-700">Detalle por día</h2>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Día</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Semana pasada</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Esta semana</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.map((row, i) => {
                    const diff = row.thisWeek - row.lastWeek
                    return (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{row.day}</td>
                        <td className="px-4 py-3 text-gray-500">RD$ {row.lastWeek.toFixed(2)}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium">RD$ {row.thisWeek.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {diff >= 0 ? '+' : ''}RD$ {diff.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}