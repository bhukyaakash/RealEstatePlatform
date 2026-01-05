import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { landAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { formatArea, formatPriceINR } from '../utils/format'

export default function LandDetail() {
  const { id } = useParams()
  const [land, setLand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await landAPI.get(id)
        setLand(res.data)
      } catch (err) {
        setError(err?.response?.data?.detail || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <LoadingSpinner label="Loading property..." />
  if (error) return <div className="max-w-3xl mx-auto p-6"><ErrorMessage message={error} /></div>
  if (!land) return null

  const hasCoords = land.latitude && land.longitude

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4"><Link className="text-blue-700" to="/lands">← Back</Link></div>
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{land.title}</h1>
            <div className="text-gray-600">{land.address}, {land.city}, {land.state} - {land.pincode}</div>
            <div className="mt-2 text-sm">{land.description || 'No description'}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Price</div>
            <div className="text-2xl font-bold">{formatPriceINR(land.price)}</div>
            <div className="text-sm text-gray-600 mt-2">Area</div>
            <div className="font-semibold">{formatArea(land.area_sqft)}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold mb-2">Documents</div>
          {land.documents?.length ? (
            <ul className="list-disc pl-5 text-sm">
              {land.documents.map((d) => (
                <li key={d.id}><a className="text-blue-700" href={d.document_url} target="_blank">{d.document_type} - {d.file_name}</a></li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">No documents uploaded</div>
          )}
        </div>

        {hasCoords && (
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">Location</div>
            <MapContainer center={[land.latitude, land.longitude]} zoom={13} scrollWheelZoom>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[land.latitude, land.longitude]}>
                <Popup>{land.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}
