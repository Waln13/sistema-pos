import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [salesByDay, setSalesByDay] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [s, d, t, l] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/reports/by-day'),
        api.get('/reports/top-products'),
        api.get('/reports/low-stock')
      ])
      setSummary(s.data)
      setSalesByDay(d.data)
      setTopProducts(t.data)
      setLowStockProducts(l.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setTextColor(30, 30, 30)
    doc.text('Sistema POS — Reporte de Ventas', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-DO')}`, 14, 28)

    doc.setDrawColor(200)
    doc.line(14, 32, 196, 32)

    doc.setFontSize(13)
    doc.setTextColor(30)
    doc.text('Resumen General', 14, 42)

    autoTable(doc, {
      startY: 46,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de ventas', summary.totalSales],
        ['Ingresos totales', `RD$ ${summary.totalRevenue.toFixed(2)}`],
        ['Productos activos', summary.totalProducts],
        ['Productos con stock bajo', summary.lowStock],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14 }
    })

    doc.setFontSize(13)
    doc.setTextColor(30)
    doc.text('Productos más vendidos', 14, doc.lastAutoTable.finalY + 14)

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 18,
      head: [['Producto', 'Unidades vendidas']],
      body: topProducts.map(p => [p.name, p.quantity]),
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] },
      margin: { left: 14 }
    })

    doc.setFontSize(13)
    doc.setTextColor(30)
    doc.text('Ingresos por día', 14, doc.lastAutoTable.finalY + 14)

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 18,
      head: [['Fecha', 'Total (RD$)']],
      body: salesByDay.map(d => [d.date, `RD$ ${d.total.toFixed(2)}`]),
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] },
      margin: { left: 14 }
    })

    if (lowStockProducts.length > 0) {
      doc.setFontSize(13)
      doc.setTextColor(30)
      doc.text('Productos con stock bajo', 14, doc.lastAutoTable.finalY + 14)

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 18,
        head: [['Producto', 'Categoría', 'Stock']],
        body: lowStockProducts.map(p => [p.name, p.category || '—', p.stock]),
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] },
        margin: { left: 14 }
      })
    }

    doc.save(`reporte-pos-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Reportes</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando reportes...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Resumen del sistema</h2>
              <button
                onClick={exportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                📄 Exportar PDF
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total ventas</p>
                <p className="text-3xl font-bold text-gray-800">{summary.totalSales}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Ingresos totales</p>
                <p className="text-3xl font-bold text-green-600">RD$ {summary.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Productos activos</p>
                <p className="text-3xl font-bold text-gray-800">{summary.totalProducts}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Stock bajo</p>
                <p className="text-3xl font-bold text-red-500">{summary.lowStock}</p>
              </div>
            </div>

            {/* Alertas de stock bajo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚠️</span>
                <h2 className="text-base font-semibold text-gray-700">Productos con stock bajo</h2>
                {lowStockProducts.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {lowStockProducts.length} producto(s)
                  </span>
                )}
              </div>
              {lowStockProducts.length === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span>✅</span>
                  <p className="text-sm">Todo el inventario tiene stock suficiente</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-red-50 border-b border-red-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-red-700 font-medium">Producto</th>
                        <th className="text-left px-4 py-3 text-red-700 font-medium">Categoría</th>
                        <th className="text-left px-4 py-3 text-red-700 font-medium">Stock actual</th>
                        <th className="text-left px-4 py-3 text-red-700 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-red-50 transition">
                          <td className="px-4 py-3 text-gray-800 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-gray-500">{p.category || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`font-bold ${p.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                              {p.stock} unidades
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.stock === 0
                                ? 'bg-red-100 text-red-700'
                                : p.stock <= 5
                                ? 'bg-red-100 text-red-600'
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              {p.stock === 0 ? '🚫 Sin stock' : p.stock <= 5 ? '🔴 Crítico' : '🟠 Bajo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-base font-semibold text-gray-700 mb-4">Ingresos por día</h2>
              {salesByDay.length === 0 ? (
                <p className="text-sm text-gray-400">No hay datos aún</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => `RD$ ${val.toFixed(2)}`} />
                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-700 mb-4">Productos más vendidos</h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-gray-400">No hay datos aún</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}