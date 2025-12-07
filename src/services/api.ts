const API_BASE_URL = 'http://localhost:8000'

// Types
export interface Venue {
  id: number
  name: string
  address: string
  city: string
  capacity: number
  image_url: string | null
  created_at: string
}

export interface VenueWithEvents extends Venue {
  events: EventSummary[]
}

export interface EventSummary {
  id: number
  title: string
  event_date: string
  category: string
}

export interface Event {
  id: number
  venue_id: number
  title: string
  description: string
  category: string
  event_date: string
  event_time: string
  image_url: string | null
  created_at: string
}

export interface EventWithVenue extends Event {
  venue: {
    id: number
    name: string
    city: string
    capacity: number
  }
}

export interface Ticket {
  id: number
  event_id: number
  buyer_name: string
  buyer_email: string
  ticket_type: string
  price: number
  confirmation_code: string
  purchase_date: string
  status: string
}

export interface CreateVenue {
  name: string
  address: string
  city: string
  capacity: number
}

export interface CreateEvent {
  venue_id: number
  title: string
  description?: string
  category?: string
  event_date: string
  event_time: string
  image_url?: string
}

export interface CreateTicket {
  event_id: number
  buyer_name: string
  buyer_email: string
  ticket_type: string
  price: number
}

export interface DashboardStats {
  total_venues: number
  total_events: number
  total_tickets: number
  total_revenue: number
  confirmed_tickets: number
  cancelled_tickets: number
  recent_tickets: {
    id: number
    confirmation_code: string
    buyer_name: string
    buyer_email: string
    event_id: number
    ticket_type: string
    price: number
    status: string
    purchase_date: string
  }[]
  upcoming_events: {
    id: number
    title: string
    event_date: string
    event_time: string
    category: string
    venue_id: number
  }[]
}

// API helper function
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || 'API request failed')
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null as T
  }
  
  return response.json()
}

// API methods
export const api = {
  // Venues
  getVenues: (params?: { search?: string; city?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.city) searchParams.append('city', params.city)
    const query = searchParams.toString()
    return fetchApi<Venue[]>(`/venues${query ? `?${query}` : ''}`)
  },
  
  getVenue: (id: number) => fetchApi<VenueWithEvents>(`/venues/${id}`),
  
  createVenue: (venue: CreateVenue) => 
    fetchApi<Venue>('/venues', {
      method: 'POST',
      body: JSON.stringify(venue),
    }),
  
  updateVenue: (id: number, venue: Partial<CreateVenue>) =>
    fetchApi<Venue>(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(venue),
    }),
  
  deleteVenue: (id: number) =>
    fetchApi<void>(`/venues/${id}`, { method: 'DELETE' }),
  
  getVenueEvents: (venueId: number) => 
    fetchApi<Event[]>(`/venues/${venueId}/events`),

  // Events
  getEvents: (params?: { category?: string; venue_id?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.venue_id) searchParams.append('venue_id', params.venue_id.toString())
    if (params?.search) searchParams.append('search', params.search)
    const query = searchParams.toString()
    return fetchApi<EventWithVenue[]>(`/events${query ? `?${query}` : ''}`)
  },
  
  getEvent: (id: number) => fetchApi<EventWithVenue>(`/events/${id}`),
  
  createEvent: (event: CreateEvent) =>
    fetchApi<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),
  
  updateEvent: (id: number, event: Partial<CreateEvent>) =>
    fetchApi<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    }),
  
  deleteEvent: (id: number) =>
    fetchApi<void>(`/events/${id}`, { method: 'DELETE' }),

  // Tickets
  getTickets: () => fetchApi<Ticket[]>('/tickets'),
  
  getTicket: (id: number) => fetchApi<Ticket>(`/tickets/${id}`),
  
  getTicketByCode: (code: string) => fetchApi<Ticket>(`/tickets/code/${code}`),
  
  getEventTickets: (eventId: number) => fetchApi<Ticket[]>(`/tickets/event/${eventId}`),
  
  purchaseTicket: (ticket: CreateTicket) =>
    fetchApi<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),
  
  cancelTicket: (id: number) =>
    fetchApi<void>(`/tickets/${id}`, { method: 'DELETE' }),

  // Stats
  getDashboardStats: () => fetchApi<DashboardStats>('/stats/dashboard'),
}
