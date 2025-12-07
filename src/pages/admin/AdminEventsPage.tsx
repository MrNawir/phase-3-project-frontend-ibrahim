import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, Calendar } from 'lucide-react'
import { api, EventWithVenue, Venue, CreateEvent } from '../../services/api'

const CATEGORIES = ['Concert', 'Sports', 'Comedy', 'Arts & Theatre', 'Festival', 'Other']

export function AdminEventsPage() {
  const [events, setEvents] = useState<EventWithVenue[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventWithVenue | null>(null)
  const [formData, setFormData] = useState<CreateEvent>({
    venue_id: 0, title: '', description: '', category: '', event_date: '', event_time: '', image_url: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventsData, venuesData] = await Promise.all([api.getEvents(), api.getVenues()])
      setEvents(eventsData)
      setVenues(venuesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingEvent(null)
    setFormData({ venue_id: venues[0]?.id || 0, title: '', description: '', category: CATEGORIES[0], event_date: '', event_time: '', image_url: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (event: EventWithVenue) => {
    setEditingEvent(event)
    setFormData({
      venue_id: event.venue_id,
      title: event.title,
      description: event.description || '',
      category: event.category || '',
      event_date: event.event_date,
      event_time: event.event_time,
      image_url: event.image_url || ''
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, formData)
      } else {
        await api.createEvent(formData)
      }
      setIsModalOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save event:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.deleteEvent(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Concert': 'badge-secondary',
      'Sports': 'badge-accent',
      'Comedy': 'badge-info',
      'Arts & Theatre': 'badge-warning',
    }
    return colors[category] || 'badge-ghost'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" /> Events
          </h1>
          <p className="text-base-content/60 mt-1">{events.length} events scheduled</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Venue</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="hover">
                <th>{event.id}</th>
                <td className="font-medium">{event.title}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.event_time}</td>
                <td>{event.venue?.name || 'Unknown'}</td>
                <td>
                  <span className={`badge badge-outline ${getCategoryBadge(event.category)}`}>
                    {event.category}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-square btn-sm btn-ghost" onClick={() => openEditModal(event)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-base-content/50">
                  No events yet. Create your first event!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Event Title</span></label>
                <input 
                  type="text" 
                  placeholder="Event Title" 
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Date</span></label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Time</span></label>
                <input 
                  type="time" 
                  className="input input-bordered"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Venue</span></label>
                <select 
                  className="select select-bordered"
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: parseInt(e.target.value) })}
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Category</span></label>
                <select 
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Image URL</span></label>
                <input 
                  type="url" 
                  placeholder="https://example.com/image.jpg" 
                  className="input input-bordered"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  placeholder="Event details..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}
