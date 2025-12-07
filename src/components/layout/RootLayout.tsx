import { Outlet, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Ticket, Calendar, MapPin } from 'lucide-react'

export function RootLayout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content font-sans transition-colors duration-300">
      {/* Navbar */}
      <div className="navbar bg-base-100/80 shadow-lg sticky top-0 z-50 backdrop-blur-xl border-b border-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200">
              <li><Link to="/events" className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Events</Link></li>
              <li><Link to="/venues" className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Venues</Link></li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight gap-2 hover:bg-primary/10">
            <Ticket className="w-6 h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TicketToU</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium gap-1">
            <li>
              <Link to="/events" className={`rounded-lg transition-all ${location.pathname === '/events' ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'}`}>
                <Calendar className="w-4 h-4" /> Events
              </Link>
            </li>
            <li>
              <Link to="/venues" className={`rounded-lg transition-all ${location.pathname === '/venues' ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'}`}>
                <MapPin className="w-4 h-4" /> Venues
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          <Link to="/login" className="btn btn-primary btn-sm shadow-md hover:shadow-lg transition-shadow">Sign In</Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <aside>
          <span className="footer-title text-2xl font-bold text-primary">TicketToU</span>
          <p>Your gateway to live events.<br/>Providing reliable ticketing since 2025.</p>
        </aside>
      </footer>
    </div>
  )
}
