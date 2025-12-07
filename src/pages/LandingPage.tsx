import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Music, Trophy, Theater, Users, ArrowRight, Star, Zap, Loader2 } from 'lucide-react'
import { api, EventWithVenue, DashboardStats } from '../services/api'

export function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState<EventWithVenue[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventsData, statsData] = await Promise.all([
        api.getEvents(),
        api.getDashboardStats()
      ])
      setFeaturedEvents(eventsData.slice(0, 3))
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const categories = [
    { name: 'Concert', icon: Music, color: 'primary' },
    { name: 'Sports', icon: Trophy, color: 'secondary' },
    { name: 'Arts & Theatre', icon: Theater, color: 'accent' },
    { name: 'Comedy', icon: Users, color: 'info' },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <div className="hero min-h-[80vh] relative overflow-hidden" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop)'}}>
        <div className="hero-overlay bg-gradient-to-br from-base-100/90 via-base-100/70 to-transparent"></div>
        <div className="hero-content text-center py-20">
          <div className="max-w-2xl animate-fade-in">
            <div className="badge badge-primary badge-lg gap-2 mb-6 animate-pulse-slow">
              <Sparkles className="w-4 h-4" /> Your Gateway to Live Events
            </div>
            <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Live is Better.
              </span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-base-content/80 max-w-xl mx-auto">
              Discover and book tickets for the world's best concerts, sports, and theatre events. Your next unforgettable memory is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all gap-2 group">
                Browse Events 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/venues" className="btn btn-outline btn-lg hover:btn-secondary transition-all">
                Explore Venues
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-base-content/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats?.total_events || 0}</div>
                <div className="text-sm text-base-content/60">Live Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{stats?.total_tickets || 0}</div>
                <div className="text-sm text-base-content/60">Tickets Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats?.total_venues || 0}</div>
                <div className="text-sm text-base-content/60">Venues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Featured Events
            </h2>
            <p className="text-base-content/60 mt-1">Don't miss these trending experiences</p>
          </div>
          <Link to="/events" className="btn btn-ghost gap-2 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-base-content/60">
              No events available yet. Check back soon!
            </div>
          ) : (
            featuredEvents.map((event, i) => (
              <Link 
                key={event.id} 
                to={`/events/${event.id}`}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <figure className="relative h-52 overflow-hidden">
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="badge badge-primary">{event.category}</span>
                  </div>
                </figure>
                <div className="card-body p-5">
                  <h2 className="card-title text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-base-content/70">
                    {event.venue?.name || 'Unknown Venue'}{event.venue?.city ? `, ${event.venue.city}` : ''}
                  </p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div>
                      <span className="text-sm text-base-content/50">{formatEventDate(event.event_date)}</span>
                    </div>
                    <button className="btn btn-primary btn-sm group-hover:btn-secondary transition-colors">
                      Get Tickets
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
          <p className="text-base-content/60">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link 
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className={`card bg-base-100 border-2 border-base-200 hover:border-${cat.color} cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group animate-slide-up`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="card-body items-center text-center p-6">
                <div className={`p-4 rounded-2xl bg-${cat.color}/10 group-hover:bg-${cat.color}/20 transition-colors mb-3`}>
                  <cat.icon className={`w-8 h-8 text-${cat.color}`} />
                </div>
                <h3 className="card-title text-lg">{cat.name}</h3>
                <p className="text-sm text-base-content/50">View Events</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content overflow-hidden">
          <div className="card-body p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6" />
                <span className="font-medium">Premium Experience</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Never Miss a Show</h3>
              <p className="text-primary-content/80 max-w-md">
                Get early access to tickets, exclusive pre-sales, and VIP experiences for your favorite events.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/events" className="btn btn-lg bg-white text-primary hover:bg-white/90 shadow-lg">
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
