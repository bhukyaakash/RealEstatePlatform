import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI, userAPI } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      setToken(res.data.access_token)
      const me = await userAPI.me()
      setUser(me.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <div className="mb-3 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">No account? <Link className="text-blue-700" to="/register">Register</Link></p>
    </div>
  )
}
