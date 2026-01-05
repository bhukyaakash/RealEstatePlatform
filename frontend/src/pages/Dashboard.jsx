import { useEffect, useState } from 'react'
import { landAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await landAPI.my()
        const lands = res.data
        setStats({
          total: lands.length,
          verified: lands.filter(l => l.is_verified).length,
          pending: lands.filter(l => !l.is_verified).length
        })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><div className="text-gray-600">Total</div><div className="text-3xl font-bold">{stats.total}</div></div>
        <div className="card"><div className="text-gray-600">Verified</div><div className="text-3xl font-bold">{stats.verified}</div></div>
        <div className="card"><div className="text-gray-600">Pending</div><div className="text-3xl font-bold">{stats.pending}</div></div>
      </div>
    </div>
  )
}
