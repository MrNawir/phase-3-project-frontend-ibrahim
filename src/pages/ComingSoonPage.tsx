import { Link } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'

export function ComingSoonPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Clock className="w-16 h-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-base-content/70 mb-8">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>
        <Link to="/" className="btn btn-primary gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
