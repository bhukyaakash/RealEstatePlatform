import { useState } from 'react'
import { userAPI } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [msg, setMsg] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    const res = await userAPI.updateMe(form)
    setUser(res.data)
    setMsg('Saved')
    setTimeout(() => setMsg(null), 1500)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {msg && <div className="mb-3 p-3 rounded bg-green-50 text-green-700 border border-green-200">{msg}</div>}
      <form onSubmit={save} className="card space-y-3">
        <div>
          <label className="text-sm text-gray-700">Full name</label>
          <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-700">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button className="btn-primary">Save</button>
      </form>
    </div>
  )
}
