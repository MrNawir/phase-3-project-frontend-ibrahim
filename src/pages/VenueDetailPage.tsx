import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users, Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react'
import { api, VenueWithEvents } from '../services/api'

export function VenueDetailPage() {
  const { id } = useParams()
  const [venue, setVenue] = useState<VenueWithEvents | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVenue()
  }, [id])

  const loadVenue = async () => {
    try {
      setLoading(true)
      const data = await api.getVenue(Number(id))
      setVenue(data)
    } catch (error) {
      console.error('Failed to load venue:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-base-content/60">Venue not found</p>
        <Link to="/venues" className="btn btn-primary mt-4">Back to Venues</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12 animate-fade-in">
      {/* Hero Section */}
      <div className="h-[45vh] w-full relative">
        <img 
          src={`https://source.unsplash.com/random/1200x600?venue,stadium&sig=${venue.id}`} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/50 to-transparent"></div>
        
        {/* Back Button */}
        <Link 
          to="/venues" 
          className="absolute top-6 left-6 btn btn-circle btn-ghost bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        {/* Venue Info Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-200">
          <div className="card-body p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{venue.name}</h1>
                <div className="flex flex-wrap gap-4 text-base-content/70 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{venue.address}, {venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span>Capacity: {venue.capacity.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  {venue.address}, {venue.city}. Capacity: {venue.capacity.toLocaleString()} seats.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <a href="#" className="btn btn-primary gap-2">
                  <ExternalLink className="w-4 h-4" /> Official Website
                </a>
                <a href="#" className="btn btn-outline gap-2">
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8">
          <div className="card bg-base-200 h-64 flex items-center justify-center">
            <div className="text-center text-base-content/50">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Upcoming Events
            </h2>
            <Link to="/events" className="btn btn-ghost btn-sm">View All Events</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.events && venue.events.length > 0 ? (
              venue.events.map((event) => (
                <Link 
                  key={event.id} 
                  to={`/events/${event.id}`}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <figure className="h-40 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/400x300?event&sig=${event.id}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>
                  <div className="card-body p-5">
                    <div className="badge badge-primary badge-sm mb-2">{event.category}</div>
                    <h3 className="card-title text-lg">{event.title}</h3>
                    <p className="text-sm text-base-content/60">{formatEventDate(event.event_date)}</p>
                    <div className="card-actions justify-end mt-2">
                      <span className="text-primary font-medium text-sm group-hover:underline">Get Tickets →</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-base-content/50">
                No upcoming events at this venue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
