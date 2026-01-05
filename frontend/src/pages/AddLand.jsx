import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { landAPI } from '../services/api'

export default function AddLand() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [landId, setLandId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    area_sqft: '',
    price: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [docs, setDocs] = useState({
    ownership_deed: null,
    survey_document: null,
    tax_receipt: null
  })

  const navigate = useNavigate()

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await landAPI.create({
        ...form,
        area_sqft: Number(form.area_sqft),
        price: Number(form.price)
      })
      setLandId(res.data.id)
      setStep(2)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  const uploadAll = async () => {
    if (!landId) return
    setLoading(true)
    setError(null)
    try {
      const entries = Object.entries(docs).filter(([, f]) => !!f)
      for (const [type, file] of entries) {
        await landAPI.uploadDoc(landId, type, file)
      }
      navigate(`/lands/${landId}`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      {error && <div className="mb-3 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      {step === 1 && (
        <form onSubmit={create} className="card space-y-3">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Area (sqft)" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} required />
            <input className="input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
            <input className="input" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save & Continue'}</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="card space-y-3">
          <div className="text-sm text-gray-700">Upload documents (optional but recommended for faster verification).</div>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm">Ownership deed
              <input type="file" className="input mt-1" onChange={(e) => setDocs({ ...docs, ownership_deed: e.target.files?.[0] || null })} />
            </label>
            <label className="text-sm">Survey document
              <input type="file" className="input mt-1" onChange={(e) => setDocs({ ...docs, survey_document: e.target.files?.[0] || null })} />
            </label>
            <label className="text-sm">Tax receipt
              <input type="file" className="input mt-1" onChange={(e) => setDocs({ ...docs, tax_receipt: e.target.files?.[0] || null })} />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => navigate(`/lands/${landId}`)}>Skip</button>
            <button className="btn-primary" disabled={loading} onClick={uploadAll}>{loading ? 'Uploading...' : 'Upload & Finish'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
