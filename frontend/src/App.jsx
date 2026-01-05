import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

import Navbar from './components/common/Navbar'

import LandList from './pages/LandList'
import LandDetail from './pages/LandDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddLand from './pages/AddLand'
import MyLands from './pages/MyLands'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import VerificationPanel from './pages/VerificationPanel'
import NotFound from './pages/NotFound'

function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandList />} />
        <Route path="/lands" element={<LandList />} />
        <Route path="/lands/:id" element={<LandDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/lands/add" element={<PrivateRoute><AddLand /></PrivateRoute>} />
        <Route path="/my-lands" element={<PrivateRoute><MyLands /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminPanel /></PrivateRoute>} />
        <Route path="/verification" element={<PrivateRoute roles={["admin","verifier"]}><VerificationPanel /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
