import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()

  const linkCls = (to) =>
    `px-3 py-2 rounded-lg ${pathname === to ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">RealEstatePro</Link>
        <div className="flex items-center gap-2">
          <Link className={linkCls('/lands')} to="/lands">Lands</Link>
          {user && (
            <>
              <Link className={linkCls('/dashboard')} to="/dashboard">Dashboard</Link>
              <Link className={linkCls('/lands/add')} to="/lands/add">Add</Link>
              <Link className={linkCls('/my-lands')} to="/my-lands">My Lands</Link>
              <Link className={linkCls('/profile')} to="/profile">Profile</Link>
              {(user.role === 'admin' || user.role === 'verifier') && (
                <Link className={linkCls('/verification')} to="/verification">Verify</Link>
              )}
              {user.role === 'admin' && <Link className={linkCls('/admin')} to="/admin">Admin</Link>}
              <button className="btn-secondary" onClick={() => logout()}>Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link className={linkCls('/login')} to="/login">Login</Link>
              <Link className={linkCls('/register')} to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
