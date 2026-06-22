import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import SaleTicket from '../components/SaleTicket'

export default function SalesPage() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [amountPaid, setAmountPaid] = useState('')
  const [change, setChange] = useState(null)
  const [lastSale, setLastSale] = useState(null)
  const [showTicket, setShowTicket] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const ticketRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  const addToCart = (product) => {
    const existing = cart.find(i => i.productId === product.id)
    if (existing) {
      if (existing.quantity >= product.stock) return alert('Stock insuficiente')
      setCart(cart.map(i =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      if (product.stock === 0) return alert('Sin stock disponible')
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        stock: product.stock
      }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(i => i.productId !== productId))
  }

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return
    const item = cart.find(i => i.productId === productId)
    if (qty > item.stock) return alert('Stock insuficiente')
    setCart(cart.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
  }

  const total = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const handleAmountChange = (e) => {
    const val = e.target.value
    setAmountPaid(val)
    const paid = parseFloat(val)
    if (!isNaN(paid) && paid >= total) {
      setChange(paid - total)
    } else {
      setChange(null)
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `Ticket-${lastSale?.id}`
  })

  const handleSale = async () => {
    if (cart.length === 0) return alert('El carrito está vacío')
    if (amountPaid && parseFloat(amountPaid) < total)
      return alert('El monto recibido es menor al total')
    setLoading(true)
    try {
      const res = await api.post('/sales', {
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      })
      setLastSale({
        id: res.data.id,
        total: res.data.total,
        createdAt: res.data.createdAt,
        userName: 'Cajero',
        items: cart.map(i => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      })
      setShowTicket(true)
      setCart([])
      setAmountPaid('')
      setChange(null)
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Sistema POS — Ventas</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">

        {/* Panel izquierdo — Productos */}
        <div className="flex-1 p-6 overflow-y-auto">
          <input
            type="text"
            placeholder="Buscar producto o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filtros de categoría */}
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.stock === 0}
                className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <p className="font-medium text-gray-800 text-sm mb-1">{p.name}</p>
                <p className="text-xs text-gray-400 mb-2">{p.category || 'Sin categoría'}</p>
                <p className="text-blue-600 font-semibold text-sm">RD$ {p.price.toFixed(2)}</p>
                <p className={`text-xs mt-1 ${p.stock <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                  Stock: {p.stock}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Panel derecho — Carrito */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Carrito</h2>
            <p className="text-xs text-gray-400">{cart.length} producto(s)</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-8">Agrega productos haciendo clic en ellos</p>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-800 flex-1">{item.name}</p>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
                      >−</button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
                      >+</button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      RD$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">RD$ {total.toFixed(2)}</span>
            </div>

            {cart.length > 0 && (
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1.5 block">
                  💵 Monto recibido (RD$)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {amountPaid && parseFloat(amountPaid) < total && (
                  <p className="text-red-500 text-xs mt-1">⚠️ Monto insuficiente</p>
                )}
                {change !== null && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-green-600 font-medium">Cambio a devolver</p>
                    <p className="text-xl font-bold text-green-600">RD$ {change.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSale}
              disabled={loading || cart.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Procesando...' : '💳 Procesar venta'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal ticket */}
      {showTicket && lastSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Venta completada ✅</h3>
              <button
                onClick={() => setShowTicket(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >✕</button>
            </div>

            <SaleTicket
              ref={ticketRef}
              sale={lastSale}
              amountPaid={amountPaid || null}
              change={change}
            />

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowTicket(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
              >
                🖨️ Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}