import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { useTheme } from '../hooks/useTheme'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const { dark, toggleTheme } = useTheme()

  useEffect(() => {
    api.get('/reports/summary').then(res => setSummary(res.data)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const modules = [
     {
    title: 'Inventario',
    description: 'Gestiona productos y stock',
    path: '/inventory',
    color: 'from-blue-600 to-blue-700',
    shadow: 'shadow-blue-500/20',
    roles: ['ADMIN', 'CAJERO'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
     },
    {
    title: 'Ventas',
    description: 'Procesa ventas y pagos',
    path: '/sales',
    color: 'from-green-600 to-green-700',
    shadow: 'shadow-green-500/20',
    roles: ['ADMIN', 'CAJERO'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },

    {
      title: 'Ganancias',
      description: 'Precio costo vs venta',
      path: '/profit',
      color: 'from-emerald-600 to-emerald-700',
      shadow: 'shadow-emerald-500/20',
      roles: ['ADMIN'],
      icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
      )
    },
    {
    title: 'Reportes',
    description: 'Estadísticas y exportar PDF',
    path: '/reports',
    color: 'from-purple-600 to-purple-700',
    shadow: 'shadow-purple-500/20',
    roles: ['ADMIN'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
   },

    {
    title: 'Proveedores',
    description: 'Gestiona tus distribuidores',
    path: '/suppliers',
    color: 'from-teal-600 to-teal-700',
    shadow: 'shadow-teal-500/20',
    roles: ['ADMIN'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },

    	{
    title: 'Pérdidas',
    description: 'Pérdidas y devoluciones',
    path: '/losses',
    color: 'from-red-600 to-red-700',
    shadow: 'shadow-red-500/20',
    roles: ['ADMIN'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
   },

   {
  title: 'Lotes',
  description: 'Control de vencimientos',
  path: '/lots',
  color: 'from-indigo-600 to-indigo-700',
  shadow: 'shadow-indigo-500/20',
  roles: ['ADMIN'],
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
  },
  
    {
    title: 'Historial',
    description: 'Ver todas las ventas',
    path: '/sales-history',
    color: 'from-cyan-600 to-cyan-700',
    shadow: 'shadow-cyan-500/20',
    roles: ['ADMIN'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
   },  

   {
  title: 'Backup',
  description: 'Exportar datos a Excel',
  path: '/backup',
  color: 'from-gray-600 to-gray-700',
  shadow: 'shadow-gray-500/20',
  roles: ['ADMIN'],
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
  },
  ]

  if (user?.role === 'ADMIN') {
    modules.push({
      title: 'Usuarios',
      description: 'Gestiona el equipo',
      path: '/users',
      color: 'from-amber-600 to-amber-700',
      shadow: 'shadow-amber-500/20',
      roles: ['ADMIN'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    })
  }

  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-gray-900 dark:text-white font-semibold text-lg">Sistema POS</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle dark/light */}
          <button
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 w-9 h-9 rounded-lg flex items-center justify-center transition"
            title={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="text-right">
            <p className="text-gray-900 dark:text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.role === 'ADMIN' ? 'Administrador' : 'Cajero'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bienvenido, {user?.name} 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Panel de control del Sistema POS</p>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total ventas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalSales}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Ingresos totales</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">RD$ {summary.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Productos activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalProducts}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Stock bajo</p>
              <p className="text-2xl font-bold text-red-500 dark:text-red-400">{summary.lowStock}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {modules
    .filter(m => m.roles.includes(user?.role))
    .map(m => (
      <button
        key={m.path}
        onClick={() => navigate(m.path)}
        className={`bg-gradient-to-br ${m.color} ${m.shadow} shadow-lg rounded-2xl p-6 text-left hover:scale-105 transition-transform duration-200`}
      >
        <div className="text-white mb-3">{m.icon}</div>
        <p className="text-white font-semibold text-base">{m.title}</p>
        <p className="text-white/70 text-xs mt-1">{m.description}</p>
      </button>
    ))
  }
</div>
      </div>
    </div>
  )
}