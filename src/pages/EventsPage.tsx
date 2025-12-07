import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { api, EventWithVenue } from '../services/api'

// Ticket price tiers by event category for sorting
const EVENT_PRICES: Record<string, number> = {
  'Sports': 500,
  'Concert': 2000,
  'Comedy': 1500,
  'Festival': 2500,
}

export function EventsPage() {
  const [events, setEvents] = useState<EventWithVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('date')

  const categories = ['Sports', 'Concert', 'Comedy', 'Festival']

  useEffect(() => {
    loadEvents()
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const params: { search?: string; category?: string } = {}
      if (searchQuery) params.search = searchQuery
      const data = await api.getEvents(params)
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = new Set(selectedCategories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    setSelectedCategories(newCategories)
  }

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events]

    // Filter by selected categories
    if (selectedCategories.size > 0) {
      result = result.filter(event => selectedCategories.has(event.category))
    }

    // Sort events
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (EVENT_PRICES[a.category] || 0) - (EVENT_PRICES[b.category] || 0))
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (EVENT_PRICES[b.category] || 0) - (EVENT_PRICES[a.category] || 0))
    }

    return result
  }, [events, selectedCategories, sortBy])

  const formatEventDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase()
    return `${formattedDate} • ${timeStr}`
  }

  const getBasePrice = (category: string) => {
    return EVENT_PRICES[category] || 500
  }

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              {/* Search Input */}
              <div className="form-control mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="input input-bordered input-sm w-full pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2">Categories</h3>
              
              {categories.map(category => (
                <div key={category} className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">{category}</span> 
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={selectedCategories.has(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  </label>
                </div>
              ))}
              
              <div className="divider"></div>
              
              <h4 className="font-medium mb-2">Price Guide (KES)</h4>
              <div className="text-xs space-y-1 text-base-content/70">
                <div className="flex justify-between">
                  <span>Sports</span>
                  <span>from 500</span>
                </div>
                <div className="flex justify-between">
                  <span>Comedy</span>
                  <span>from 1,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Concert</span>
                  <span>from 2,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Festival</span>
                  <span>from 2,500</span>
                </div>
              </div>

              {selectedCategories.size > 0 && (
                <>
                  <div className="divider"></div>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedCategories(new Set())}
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Events Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">All Events</h1>
              <p className="text-sm text-base-content/60 mt-1">
                {filteredAndSortedEvents.length} events found
              </p>
            </div>
            <select 
              className="select select-bordered select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by: Date</option>
              <option value="price-low">Sort by: Price Low-High</option>
              <option value="price-high">Sort by: Price High-Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-base-content/60">
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredAndSortedEvents.map((event) => (
                <div key={event.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all">
                  <figure className="h-48 relative">
                    <img 
                      src={event.image_url || `https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800`} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-primary">From KES {getBasePrice(event.category).toLocaleString()}</span>
                    </div>
                  </figure>
                  <div className="card-body p-5">
                    <div className="text-sm text-primary font-bold">
                      {formatEventDate(event.event_date, event.event_time)}
                    </div>
                    <h2 className="card-title text-lg">{event.title}</h2>
                    <p className="text-sm text-neutral-500">
                      {event.venue?.name || 'Unknown Venue'}{event.venue?.city ? `, ${event.venue.city}` : ''}
                    </p>
                    <div className="card-actions justify-between items-center mt-4">
                      <span className="badge badge-outline">{event.category}</span>
                      <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">See Tickets</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
