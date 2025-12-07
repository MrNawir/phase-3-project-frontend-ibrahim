import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ShieldCheck, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { api, EventWithVenue } from '../services/api'

// Dynamic ticket pricing by event category (in KES)
const CATEGORY_PRICES: Record<string, { Standard: number; Premium: number; VIP: number }> = {
  'Sports': { Standard: 500, Premium: 1500, VIP: 2500 },
  'Concert': { Standard: 2000, Premium: 5000, VIP: 10000 },
  'Comedy': { Standard: 1500, Premium: 3000, VIP: 5000 },
  'Festival': { Standard: 2500, Premium: 5000, VIP: 8000 },
}

// Default prices
const DEFAULT_PRICES = { Standard: 1000, Premium: 3000, VIP: 5000 }

export function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<EventWithVenue | null>(null)
  const [loading, setLoading] = useState(true)
  const [ticketCounts, setTicketCounts] = useState({ Standard: 0, VIP: 0, Premium: 0 })
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({ name: '', email: '' })
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)

  // Get prices based on event category
  const getTicketPrices = () => {
    if (!event) return DEFAULT_PRICES
    return CATEGORY_PRICES[event.category] || DEFAULT_PRICES
  }

  const TICKET_PRICES = getTicketPrices()

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await api.getEvent(Number(id))
      setEvent(data)
    } catch (error) {
      console.error('Failed to load event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = (type: 'Standard' | 'VIP' | 'Premium') => {
    setTicketCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))
  }

  const handleDecrement = (type: 'Standard' | 'VIP' | 'Premium') => {
    setTicketCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))
  }

  const total = Object.entries(ticketCounts).reduce(
    (sum, [type, count]) => sum + (TICKET_PRICES[type as keyof typeof TICKET_PRICES] * count), 0
  )

  const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0)

  const handleCheckout = async () => {
    if (!event || !buyerInfo.name || !buyerInfo.email) return
    
    try {
      setPurchasing(true)
      const tickets = []
      
      for (const [type, count] of Object.entries(ticketCounts)) {
        for (let i = 0; i < count; i++) {
          const ticket = await api.purchaseTicket({
            event_id: event.id,
            buyer_name: buyerInfo.name,
            buyer_email: buyerInfo.email,
            ticket_type: type,
            price: TICKET_PRICES[type as keyof typeof TICKET_PRICES]
          })
          tickets.push(ticket)
        }
      }
      
      setPurchaseSuccess(tickets[0]?.confirmation_code || 'SUCCESS')
      setTicketCounts({ Standard: 0, VIP: 0, Premium: 0 })
    } catch (error) {
      console.error('Failed to purchase tickets:', error)
      alert('Failed to purchase tickets. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl">Event not found</p>
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Event Header */}
      <div className="h-[50vh] w-full relative">
        <img 
          src={event.image_url || `https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920`} 
          alt={event.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"></div>
        
        <Link 
          to="/events" 
          className="absolute top-6 left-6 btn btn-circle btn-ghost bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="container mx-auto">
            <div className="badge badge-secondary mb-4">{event.category}</div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> {event.event_time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> {event.venue?.name}, {event.venue?.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-lg leading-relaxed text-base-content/80">
              {event.description || 'Join us for an unforgettable experience! More details coming soon.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">{event.venue?.name}</h3>
                <p>{event.venue?.city} • Capacity: {event.venue?.capacity?.toLocaleString()}</p>
                <div className="h-48 bg-base-300 rounded-lg mt-4 flex items-center justify-center text-base-content/50">
                  <MapPin className="w-8 h-8 opacity-50" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Ticket Selection */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-2xl border border-base-200 sticky top-24">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Select Tickets</h2>
              
              {/* Standard */}
              <div className="bg-base-200 p-4 rounded-xl mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">Standard</span>
                  <span className="font-bold">KES {TICKET_PRICES.Standard.toLocaleString()}</span>
                </div>
                <p className="text-xs text-base-content/60 mb-3">General Admission</p>
                <div className="flex items-center justify-end gap-3">
                  <button className="btn btn-circle btn-sm btn-ghost" onClick={() => handleDecrement('Standard')}>-</button>
                  <span className="w-8 text-center font-mono text-lg">{ticketCounts.Standard}</span>
                  <button className="btn btn-circle btn-sm btn-primary" onClick={() => handleIncrement('Standard')}>+</button>
                </div>
              </div>

              {/* VIP */}
              <div className="bg-base-200 p-4 rounded-xl mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">VIP</span>
                  <span className="font-bold">KES {TICKET_PRICES.VIP.toLocaleString()}</span>
                </div>
                <p className="text-xs text-base-content/60 mb-3">Priority Entry, Lounge Access</p>
                <div className="flex items-center justify-end gap-3">
                  <button className="btn btn-circle btn-sm btn-ghost" onClick={() => handleDecrement('VIP')}>-</button>
                  <span className="w-8 text-center font-mono text-lg">{ticketCounts.VIP}</span>
                  <button className="btn btn-circle btn-sm btn-primary" onClick={() => handleIncrement('VIP')}>+</button>
                </div>
              </div>

              {/* Premium */}
              <div className="bg-base-200 p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">Premium</span>
                  <span className="font-bold">KES {TICKET_PRICES.Premium.toLocaleString()}</span>
                </div>
                <p className="text-xs text-base-content/60 mb-3">Meet & Greet, Front Row Seating</p>
                <div className="flex items-center justify-end gap-3">
                  <button className="btn btn-circle btn-sm btn-ghost" onClick={() => handleDecrement('Premium')}>-</button>
                  <span className="w-8 text-center font-mono text-lg">{ticketCounts.Premium}</span>
                  <button className="btn btn-circle btn-sm btn-primary" onClick={() => handleIncrement('Premium')}>+</button>
                </div>
              </div>

              <div className="divider"></div>

              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total ({totalTickets} tickets)</span>
                <span>KES {total.toLocaleString()}</span>
              </div>

              <button 
                className="btn btn-primary btn-block btn-lg" 
                disabled={total === 0}
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-success">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Buyer Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            {purchaseSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="font-bold text-2xl mb-2">Purchase Complete!</h3>
                <p className="text-base-content/70 mb-4">Your tickets have been purchased successfully.</p>
                <div className="bg-base-200 p-4 rounded-xl mb-6">
                  <p className="text-sm text-base-content/60">Confirmation Code</p>
                  <code className="text-lg font-mono font-bold">{purchaseSuccess}</code>
                </div>
                <p className="text-sm text-base-content/60 mb-4">
                  A confirmation email will be sent to {buyerInfo.email}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setCheckoutOpen(false)
                    setPurchaseSuccess(null)
                    setBuyerInfo({ name: '', email: '' })
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4">Complete Your Purchase</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Full Name</span></label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="input input-bordered"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="input input-bordered"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="bg-base-200 p-4 rounded-xl">
                    <h4 className="font-bold mb-2">Order Summary</h4>
                    {Object.entries(ticketCounts).map(([type, count]) => count > 0 && (
                      <div key={type} className="flex justify-between text-sm">
                        <span>{count}x {type}</span>
                        <span>KES {(TICKET_PRICES[type as keyof typeof TICKET_PRICES] * count).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="divider my-2"></div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-action">
                  <button className="btn" onClick={() => setCheckoutOpen(false)} disabled={purchasing}>Cancel</button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCheckout}
                    disabled={purchasing || !buyerInfo.name || !buyerInfo.email}
                  >
                    {purchasing && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm Purchase
                  </button>
                </div>
              </>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => !purchaseSuccess && setCheckoutOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}
