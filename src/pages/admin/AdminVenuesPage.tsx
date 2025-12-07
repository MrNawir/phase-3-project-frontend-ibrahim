import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, MapPin } from 'lucide-react'
import { api, Venue, CreateVenue } from '../../services/api'

export function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [formData, setFormData] = useState<CreateVenue>({ name: '', address: '', city: '', capacity: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    try {
      setLoading(true)
      const data = await api.getVenues()
      setVenues(data)
    } catch (error) {
      console.error('Failed to load venues:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingVenue(null)
    setFormData({ name: '', address: '', city: '', capacity: 0 })
    setIsModalOpen(true)
  }

  const openEditModal = (venue: Venue) => {
    setEditingVenue(venue)
    setFormData({ name: venue.name, address: venue.address, city: venue.city, capacity: venue.capacity })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editingVenue) {
        await api.updateVenue(editingVenue.id, formData)
      } else {
        await api.createVenue(formData)
      }
      setIsModalOpen(false)
      loadVenues()
    } catch (error) {
      console.error('Failed to save venue:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this venue?')) return
    try {
      await api.deleteVenue(id)
      loadVenues()
    } catch (error) {
      console.error('Failed to delete venue:', error)
    }
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
            <MapPin className="w-8 h-8 text-primary" /> Venues
          </h1>
          <p className="text-base-content/60 mt-1">{venues.length} venues registered</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus className="w-5 h-5" /> Add Venue
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.id} className="hover">
                <th>{venue.id}</th>
                <td className="font-medium">{venue.name}</td>
                <td className="text-base-content/70">{venue.address}</td>
                <td>{venue.city}</td>
                <td>{venue.capacity.toLocaleString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-square btn-sm btn-ghost" onClick={() => openEditModal(venue)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => handleDelete(venue.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {venues.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-base-content/50">
                  No venues yet. Add your first venue!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingVenue ? 'Edit Venue' : 'Add New Venue'}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Name</span></label>
                <input 
                  type="text" 
                  placeholder="Venue Name" 
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Address</span></label>
                <input 
                  type="text" 
                  placeholder="123 Main St" 
                  className="input input-bordered"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">City</span></label>
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="input input-bordered"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Capacity</span></label>
                  <input 
                    type="number" 
                    placeholder="5000" 
                    className="input input-bordered"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingVenue ? 'Update' : 'Create'}
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
