import { useEffect, useState } from 'react'
import { verificationAPI, landAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function VerificationPanel() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const res = await verificationAPI.pending()
      setPending(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    await verificationAPI.approve(id, notes[id] || '')
    await load()
  }

  const reject = async (id) => {
    const n = notes[id] || 'Rejected'
    await verificationAPI.reject(id, n)
    await load()
  }

  if (loading) return <LoadingSpinner label="Loading pending verifications..." />

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Verification Panel</h1>
      <div className="grid grid-cols-1 gap-4">
        {pending.map((v) => (
          <div key={v.id} className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-bold">Verification #{v.id}</div>
                <div className="text-sm text-gray-600">Land ID: {v.land_id}</div>
                <div className="text-sm text-gray-600">Status: {v.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => approve(v.id)}>Approve</button>
                <button className="btn-secondary" onClick={() => reject(v.id)}>Reject</button>
              </div>
            </div>
            <textarea
              className="input mt-3"
              placeholder="Notes (optional)"
              value={notes[v.id] || ''}
              onChange={(e) => setNotes({ ...notes, [v.id]: e.target.value })}
            />
          </div>
        ))}
        {!pending.length && <div className="text-gray-600">No pending verifications.</div>}
      </div>
    </div>
  )
}
