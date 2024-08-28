'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import TopStartups from '@/components/TopStartups'
import AddCompanyForm from '@/components/AddCompanyForm'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <TopStartups />
        <AddCompanyForm />
      </main>

      <Footer />
    </div>
  )
}