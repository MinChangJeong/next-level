import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

import LoginPage from './pages/LoginPage'
import IntroPage from './pages/IntroPage'
import MainPage from './pages/MainPage'
import ZoneListPage from './pages/ZoneListPage'
import BoothsPage from './pages/BoothsPage'
import BoothDetailPage from './pages/BoothDetailPage'
import QRPage from './pages/QRPage'
import EvaluatePage from './pages/EvaluatePage'
import MissionsPage from './pages/MissionsPage'
import ShopPage from './pages/ShopPage'
import GrowthZonePage from './pages/GrowthZonePage'
import AdminPage from './pages/AdminPage'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/main" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro" element={<PrivateRoute><IntroPage /></PrivateRoute>} />
        <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        <Route path="/booths" element={<PrivateRoute><BoothsPage /></PrivateRoute>} />
        <Route path="/zone/:zoneId" element={<PrivateRoute><ZoneListPage /></PrivateRoute>} />
        <Route path="/booth/:boothId" element={<PrivateRoute><BoothDetailPage /></PrivateRoute>} />
        <Route path="/qr" element={<PrivateRoute><QRPage /></PrivateRoute>} />
        <Route path="/evaluate/:boothId" element={<PrivateRoute><EvaluatePage /></PrivateRoute>} />
        <Route path="/missions" element={<PrivateRoute><MissionsPage /></PrivateRoute>} />
        <Route path="/shop" element={<PrivateRoute><ShopPage /></PrivateRoute>} />
        <Route path="/growth-zone" element={<PrivateRoute><GrowthZonePage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
