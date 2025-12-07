import { useState, useEffect } from 'react'
import { Search, Eye, XCircle, CheckCircle, Clock, Loader2, Tag } from 'lucide-react'
import { api, Ticket } from '../../services/api'

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await api.getTickets()
      setTickets(data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this ticket?')) return
    try {
      await api.cancelTicket(id)
      loadTickets()
    } catch (error) {
      console.error('Failed to cancel ticket:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-success gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>
      case 'cancelled':
        return <span className="badge badge-error gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>
      case 'used':
        return <span className="badge badge-info gap-1"><Clock className="w-3 h-3" /> Used</span>
      default:
        return <span className="badge badge-ghost">{status}</span>
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.confirmation_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.buyer_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tickets.length,
    confirmed: tickets.filter(t => t.status === 'confirmed').length,
    revenue: tickets.filter(t => t.status !== 'cancelled').reduce((sum, t) => sum + Number(t.price), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Tag className="w-8 h-8 text-primary" /> Tickets
          </h1>
          <p className="text-base-content/60">Manage all ticket sales and reservations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Total Tickets</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Active Tickets</div>
          <div className="stat-value text-success">{stats.confirmed}</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">KES {stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="form-control flex-1">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              placeholder="Search by code, buyer, or event..." 
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select 
          className="select select-bordered w-full sm:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="used">Used</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Buyer</th>
              <th>Event</th>
              <th>Type</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover">
                <td>
                  <code className="text-xs bg-base-200 px-2 py-1 rounded font-mono">
                    {ticket.confirmation_code}
                  </code>
                </td>
                <td>
                  <div>
                    <div className="font-medium">{ticket.buyer_name}</div>
                    <div className="text-xs text-base-content/50">{ticket.buyer_email}</div>
                  </div>
                </td>
                <td className="max-w-[200px] truncate">Event #{ticket.event_id}</td>
                <td>
                  <span className={`badge badge-sm ${
                    ticket.ticket_type === 'VIP' ? 'badge-secondary' : 
                    ticket.ticket_type === 'Premium' ? 'badge-accent' : 'badge-ghost'
                  }`}>
                    {ticket.ticket_type}
                  </span>
                </td>
                <td className="font-mono">KES {Number(ticket.price).toLocaleString()}</td>
                <td className="text-sm text-base-content/70">
                  {new Date(ticket.purchase_date).toLocaleDateString()}
                </td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    {ticket.status === 'confirmed' && (
                      <button 
                        className="btn btn-ghost btn-xs text-error" 
                        title="Cancel Ticket"
                        onClick={() => handleCancel(ticket.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-base-content/50">
            <p>No tickets found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
