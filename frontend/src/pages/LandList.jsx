import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { landAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import useGeolocation from '../hooks/useGeolocation'
import { formatArea, formatPriceINR } from '../utils/format'

// Fix default marker icons for Leaflet + Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

export default function LandList() {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('grid') // grid | map

  const { coords } = useGeolocation()

  const [filters, setFilters] = useState({
    city: '',
    state: '',
    min_price: '',
    max_price: '',
    min_area: '',
    max_area: '',
    useLocation: false,
    radius_km: 25
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        city: filters.city || undefined,
        state: filters.state || undefined,
        min_price: filters.min_price ? Number(filters.min_price) : undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        min_area: filters.min_area ? Number(filters.min_area) : undefined,
        max_area: filters.max_area ? Number(filters.max_area) : undefined,
        radius_km: filters.useLocation ? Number(filters.radius_km) : undefined,
        latitude: filters.useLocation && coords ? coords.lat : undefined,
        longitude: filters.useLocation && coords ? coords.lng : undefined,
      }
      const res = await landAPI.list(params)
      setLands(res.data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load lands')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const center = useMemo(() => {
    if (coords) return [coords.lat, coords.lng]
    const first = lands.find(l => l.latitude && l.longitude)
    if (first) return [first.latitude, first.longitude]
    return [20.5937, 78.9629]
  }, [coords, lands])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Browse Lands</h1>
        <div className="flex gap-2">
          <button className={view === 'grid' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('grid')}>Grid</button>
          <button className={view === 'map' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('map')}>Map</button>
        </div>
      </div>

      <div className="card mb-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input className="input" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <input className="input" placeholder="State" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} />
          <input className="input" placeholder="Min price" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
          <input className="input" placeholder="Max price" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
          <input className="input" placeholder="Min area (sqft)" value={filters.min_area} onChange={(e) => setFilters({ ...filters, min_area: e.target.value })} />
          <input className="input" placeholder="Max area (sqft)" value={filters.max_area} onChange={(e) => setFilters({ ...filters, max_area: e.target.value })} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={filters.useLocation} onChange={(e) => setFilters({ ...filters, useLocation: e.target.checked })} />
            Use my location (radius km)
          </label>
          <div className="flex items-center gap-2">
            <input className="input" style={{ width: 120 }} value={filters.radius_km} onChange={(e) => setFilters({ ...filters, radius_km: e.target.value })} />
            <button className="btn-primary" onClick={fetchData}>Apply</button>
            <button className="btn-secondary" onClick={() => {
              setFilters({ city: '', state: '', min_price: '', max_price: '', min_area: '', max_area: '', useLocation: false, radius_km: 25 })
              setTimeout(fetchData, 0)
            }}>Clear</button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner label="Loading lands..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lands.map((l) => (
            <Link key={l.id} to={`/lands/${l.id}`} className="card hover:shadow-md transition block">
              <div className="font-bold text-lg mb-1">{l.title}</div>
              <div className="text-sm text-gray-600 mb-2">{l.city}, {l.state}</div>
              <div className="text-sm">{formatArea(l.area_sqft)}</div>
              <div className="text-lg font-bold mt-2">{formatPriceINR(l.price)}</div>
              <div className="mt-3 text-xs">
                <span className={`px-2 py-1 rounded ${l.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {l.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && view === 'map' && (
        <div className="card">
          <MapContainer center={center} zoom={coords ? 11 : 5} scrollWheelZoom>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {coords && (
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Your location</Popup>
              </Marker>
            )}
            {lands.filter(l => l.latitude && l.longitude).map((l) => (
              <Marker key={l.id} position={[l.latitude, l.longitude]}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold">{l.title}</div>
                    <div>{l.city}, {l.state}</div>
                    <div>{formatPriceINR(l.price)}</div>
                    <Link className="text-blue-700" to={`/lands/${l.id}`}>View</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
