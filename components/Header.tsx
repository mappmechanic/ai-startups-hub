import Link from 'next/link'
import { Rocket } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Rocket className="h-8 w-8 text-indigo-600" data-testid="rocket-icon" />
          <h1 className="text-2xl font-bold text-gray-900">Startups Directory</h1>
        </div>
        <nav>
          <Link href="/map" className="text-indigo-600 hover:text-indigo-800 font-medium">View Map</Link>
        </nav>
      </div>
    </header>
  )
}