import Link from 'next/link'
import { MapPin, List, User } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" data-testid="footer">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-12">
          <Link href="/" className="flex items-center text-gray-600 hover:text-indigo-600" data-testid="footer-home-link">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Home</span>
          </Link>
          <Link href="/map" className="flex items-center text-gray-600 hover:text-indigo-600" data-testid="footer-map-link">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Map</span>
          </Link>
          <Link href="/list" className="flex items-center text-gray-600 hover:text-indigo-600" data-testid="footer-list-link">
            <List className="w-5 h-5 mr-2" />
            <span>List</span>
          </Link>
          <Link href="/profile" className="flex items-center text-gray-600 hover:text-indigo-600" data-testid="footer-profile-link">
            <User className="w-5 h-5 mr-2" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}