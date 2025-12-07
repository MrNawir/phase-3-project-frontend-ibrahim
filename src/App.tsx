import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { LandingPage } from './pages/LandingPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { VenuesPage } from './pages/VenuesPage'
import { VenueDetailPage } from './pages/VenueDetailPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { AdminVenuesPage } from './pages/admin/AdminVenuesPage'
import { AdminEventsPage } from './pages/admin/AdminEventsPage'
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage'
import { AdminLayout } from './components/layout/AdminLayout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "events/:id",
        element: <EventDetailPage />,
      },
      {
        path: "venues",
        element: <VenuesPage />,
      },
      {
        path: "venues/:id",
        element: <VenueDetailPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "venues",
        element: <AdminVenuesPage />,
      },
      {
        path: "events",
        element: <AdminEventsPage />,
      },
      {
        path: "tickets",
        element: <AdminTicketsPage />,
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
