import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', products: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/suppliers')
      setSuppliers(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/suppliers/${editing.id}`, form)
      } else {
        await api.post('/suppliers', form)
      }
      setForm({ name: '', phone: '', products: '' })
      setShowForm(false)
      setEditing(null)
      fetchSuppliers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar proveedor')
    }
  }

  const handleEdit = (supplier) => {
    setEditing(supplier)
    setForm({ name: supplier.name, phone: supplier.phone || '', products: supplier.products || '' })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proveedor?')) return
    try {
      await api.delete(`/suppliers/${id}`)
      fetchSuppliers()
    } catch (error) {
      alert('Error al eliminar proveedor')
    }
  }

  const handleWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    window.open(`https://wa.me/1${cleaned}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Proveedores</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
            <p className="text-sm text-gray-500">{suppliers.length} proveedor(es) registrado(s)</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', phone: '', products: '' }) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + Nuevo proveedor
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-4">
              {editing ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nombre del proveedor</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Ej: Distribuidora Nacional"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ej: 809-555-1234"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">Productos que vende</label>
                <textarea
                  value={form.products}
                  onChange={e => setForm({ ...form, products: e.target.value })}
                  placeholder="Ej: Bebidas gaseosas, jugos, agua..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null) }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editing ? 'Guardar cambios' : 'Crear proveedor'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando proveedores...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay proveedores registrados aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{s.name}</h3>
                {s.phone && (
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-500">📞 {s.phone}</p>
                    <button
                      onClick={() => handleWhatsApp(s.phone)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition"
                    >
                      WhatsApp
                    </button>
                  </div>
                )}
                {s.products && (
                  <p className="text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
                    📦 {s.products}
                  </p>
                )}
                <p className="text-xs text-gray-300 mt-2">
                  Registrado: {new Date(s.createdAt).toLocaleDateString('es-DO')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}