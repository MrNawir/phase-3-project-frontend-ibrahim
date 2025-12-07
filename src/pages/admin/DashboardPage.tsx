import { useState, useEffect } from 'react'
import { Calendar, MapPin, Tag, DollarSign, Ticket, Loader2, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, DashboardStats } from '../../services/api'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Revenue', value: `KES ${(stats?.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { label: 'Tickets Sold', value: stats?.total_tickets || 0, icon: Ticket, color: 'secondary' },
    { label: 'Active Events', value: stats?.total_events || 0, icon: Calendar, color: 'accent' },
    { label: 'Venues', value: stats?.total_venues || 0, icon: MapPin, color: 'info' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/60">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/events" className="btn btn-primary gap-2">
            <Calendar className="w-4 h-4" /> New Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-base-content/60">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Recent Sales</h2>
              <Link to="/admin/tickets" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover">
                      <td className="font-medium">{ticket.buyer_name}</td>
                      <td>
                        <span className={`badge badge-sm ${
                          ticket.ticket_type === 'VIP' ? 'badge-secondary' : 
                          ticket.ticket_type === 'Premium' ? 'badge-accent' : 'badge-ghost'
                        }`}>
                          {ticket.ticket_type}
                        </span>
                      </td>
                      <td className="font-mono">KES {Number(ticket.price).toLocaleString()}</td>
                      <td className="text-base-content/50 text-sm">{ticket.purchase_date ? formatTimeAgo(ticket.purchase_date) : '-'}</td>
                    </tr>
                  ))}
                  {(!stats?.recent_tickets || stats.recent_tickets.length === 0) && (
                    <tr>
                      <td colSpan={4} className="text-center text-base-content/50">No recent tickets</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Upcoming Events</h2>
              <Link to="/admin/events" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="space-y-4">
              {stats?.upcoming_events.map((event) => (
                <div key={event.id} className="p-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="text-xs text-base-content/60">{event.category}</p>
                    </div>
                    <span className="text-xs font-medium text-primary">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-base-content/50">{event.event_time}</p>
                </div>
              ))}
              {(!stats?.upcoming_events || stats.upcoming_events.length === 0) && (
                <p className="text-center text-base-content/50 py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="card-body">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/venues" className="btn btn-outline btn-sm gap-2">
              <MapPin className="w-4 h-4" /> Add Venue
            </Link>
            <Link to="/admin/events" className="btn btn-outline btn-sm gap-2">
              <Calendar className="w-4 h-4" /> Create Event
            </Link>
            <Link to="/admin/tickets" className="btn btn-outline btn-sm gap-2">
              <Tag className="w-4 h-4" /> Manage Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
