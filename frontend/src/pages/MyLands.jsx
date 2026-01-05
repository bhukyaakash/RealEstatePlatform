import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { landAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatArea, formatPriceINR } from '../utils/format'

export default function MyLands() {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await landAPI.my()
        setLands(res.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const remove = async (id) => {
    if (!confirm('Delete this property?')) return
    await landAPI.remove(id)
    setLands((prev) => prev.filter(l => l.id !== id))
  }

  if (loading) return <LoadingSpinner label="Loading your properties..." />

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link className="btn-primary" to="/lands/add">Add</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lands.map((l) => (
          <div key={l.id} className="card">
            <div className="font-bold">{l.title}</div>
            <div className="text-sm text-gray-600">{l.city}, {l.state}</div>
            <div className="text-sm mt-1">{formatArea(l.area_sqft)}</div>
            <div className="font-bold mt-2">{formatPriceINR(l.price)}</div>
            <div className="flex gap-2 mt-3">
              <Link className="btn-secondary" to={`/lands/${l.id}`}>View</Link>
              <button className="btn-secondary" onClick={() => remove(l.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
