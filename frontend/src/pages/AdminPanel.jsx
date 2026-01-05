import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', phone: '', role: 'user' })

  useEffect(() => {
    (async () => {
      try {
        const [u, l] = await Promise.all([adminAPI.users(), adminAPI.lands()])
        setUsers(u.data)
        setLands(l.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const createUser = async () => {
    const payload = { email: newUser.email, password: newUser.password, full_name: newUser.full_name, phone: newUser.phone }
    const res = await adminAPI.createUser(payload, newUser.role)
    setUsers((p) => [res.data, ...p])
    setNewUser({ email: '', password: '', full_name: '', phone: '', role: 'user' })
  }

  const setRole = async (id, role) => {
    await adminAPI.setRole(id, role)
    setUsers((p) => p.map(u => (u.id === id ? { ...u, role } : u)))
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete user?')) return
    await adminAPI.deleteUser(id)
    setUsers((p) => p.filter(u => u.id !== id))
  }

  const deleteLand = async (id) => {
    if (!confirm('Delete land?')) return
    await adminAPI.deleteLand(id)
    setLands((p) => p.filter(l => l.id !== id))
  }

  if (loading) return <LoadingSpinner label="Loading admin panel..." />

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="card">
        <h2 className="font-bold mb-3">Create User</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="input" placeholder="Full name" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} />
          <input className="input" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <select className="input" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">user</option>
            <option value="verifier">verifier</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="mt-3"><button className="btn-primary" onClick={createUser}>Create</button></div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-3">Users</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2">{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.full_name}</td>
                  <td>
                    <select className="input" value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="verifier">verifier</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td><button className="btn-secondary" onClick={() => deleteUser(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-3">All Lands</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">ID</th>
                <th>Title</th>
                <th>City</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lands.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="py-2">{l.id}</td>
                  <td>{l.title}</td>
                  <td>{l.city}</td>
                  <td>{String(l.is_verified)}</td>
                  <td><button className="btn-secondary" onClick={() => deleteLand(l.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
