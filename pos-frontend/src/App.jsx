import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import SalesPage from './pages/SalesPage'
import ReportsPage from './pages/ReportsPage'
import UsersPage from './pages/UsersPage'
import SalesHistoryPage from './pages/SalesHistoryPage'
import LossesPage from './pages/LossesPage'
import SuppliersPage from './pages/SuppliersPage'
import ProfitPage from './pages/ProfitPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute><InventoryPage /></ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute><SalesPage /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/sales-history" element={
           <ProtectedRoute allowedRoles={['ADMIN']}><SalesHistoryPage /></ProtectedRoute>
          } />

          <Route path="/losses" element={
           <ProtectedRoute allowedRoles={['ADMIN']}><LossesPage /></ProtectedRoute>
          } />

          <Route path="/suppliers" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><SuppliersPage /></ProtectedRoute>
          } />

          <Route path="/profit" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><ProfitPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App