import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, MapPin, Calendar, Tag, Ticket, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'

export function AdminLayout() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/venues', icon: MapPin, label: 'Venues' },
    { path: '/admin/events', icon: Calendar, label: 'Events' },
    { path: '/admin/tickets', icon: Tag, label: 'Tickets' },
  ]

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200 min-h-screen transition-colors duration-300">
        {/* Navbar for mobile */}
        <div className="w-full navbar bg-base-100/80 backdrop-blur-xl lg:hidden border-b border-base-200 shadow-sm">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin Panel</span>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div> 
      
      {/* Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <div className="w-72 min-h-full bg-base-100 text-base-content border-r border-base-200 flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-base-200">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <Ticket className="w-7 h-7 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TicketToU</span>
            </Link>
            <p className="text-xs text-base-content/50 mt-1">Admin Dashboard</p>
          </div>
          
          {/* Navigation */}
          <ul className="menu p-4 flex-1 gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`rounded-xl transition-all font-medium ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-content shadow-md' 
                      : 'hover:bg-base-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Bottom Actions */}
          <div className="p-4 border-t border-base-200 space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-base-content/60">Theme</span>
              <ThemeToggle />
            </div>
            <Link to="/" className="btn btn-ghost btn-block justify-start gap-2 text-base-content/70 hover:text-base-content">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
