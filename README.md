# Ticket2U Frontend 🎫

**React SPA** for the Ticket2U event ticketing platform.

---

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **DaisyUI** - Component library
- **React Router v6** - Routing
- **Lucide Icons** - Icon library

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── LandingPage.tsx
│   │   ├── EventsPage.tsx
│   │   └── VenuesPage.tsx
│   ├── services/        # API client
│   ├── App.tsx          # Main app with routes
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js 18+**
- **npm** (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access

- **App**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin

---

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎨 Features

### Public Pages
- **Landing Page** - Hero, featured events, venues
- **Events Page** - Browse and filter events by category
- **Venues Page** - Browse venues
- **Event Details** - View event info and purchase tickets

### Admin Dashboard
- **Dashboard** - Statistics overview
- **Venues Management** - CRUD operations for venues
- **Events Management** - CRUD operations for events
- **Tickets Management** - View and manage ticket sales

---

## ⚙️ Configuration

### API URL

The API base URL is configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000'
```

For production, update this to your backend URL.

---

## 🏗 Building for Production

```bash
# Build the app
npm run build

# Output is in the dist/ folder
```

The `dist/` folder can be served by any static file server (Nginx, Apache, Netlify, Vercel, etc.).

---

## 📄 License

MIT
