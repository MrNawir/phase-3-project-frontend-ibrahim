import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Calendar, Search, Loader2 } from 'lucide-react'
import { api, Venue } from '../services/api'

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const cities = ['Nairobi', 'Mombasa', 'Eldoret']

  useEffect(() => {
    loadVenues()
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVenues()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCity])

  const loadVenues = async () => {
    try {
      setLoading(true)
      const params: { search?: string; city?: string } = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCity) params.city = selectedCity
      const data = await api.getVenues(params)
      setVenues(data)
    } catch (error) {
      console.error('Failed to load venues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && venues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Discover Kenyan Venues</h1>
        <p className="text-base-content/60 max-w-2xl mx-auto">
          From iconic stadiums to vibrant concert halls, explore Kenya's premier event venues
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="join flex-1">
            <div className="join-item flex items-center px-4 bg-base-200">
              <Search className="w-5 h-5 text-base-content/50" />
            </div>
            <input 
              type="text" 
              placeholder="Search venues by name..." 
              className="input input-bordered join-item flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="select select-bordered"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-base-content/60 mt-2 text-center">
          {venues.length} venues found
        </p>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue, i) => (
          <Link 
            key={venue.id} 
            to={`/venues/${venue.id}`} 
            className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <figure className="h-48 overflow-hidden relative">
              <img 
                src={venue.image_url || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800'} 
                alt={venue.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent"></div>
            </figure>
            <div className="card-body p-5">
              <h2 className="card-title text-lg group-hover:text-primary transition-colors">
                {venue.name}
              </h2>
              <div className="flex items-center gap-1 text-sm text-base-content/60">
                <MapPin className="w-4 h-4" />
                {venue.city}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{venue.capacity.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Calendar className="w-4 h-4" />
                  <span>View Events</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {venues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-base-content/60">No venues found</p>
          <p className="text-sm text-base-content/50 mt-2">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  )
}
