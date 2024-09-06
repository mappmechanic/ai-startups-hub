'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import RecentlyAddedStartups from '@/components/RecentlyAddedStartups'
import AddCompanyForm from '@/components/AddCompanyForm'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <RecentlyAddedStartups />
        <AddCompanyForm />
      </main>
    </div>
  )
}