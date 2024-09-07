import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'
import { getSearchSuggestions } from '@/lib/db'
import { IStartup } from '@/lib/types' 
import Link from 'next/link'

export default function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
  const [suggestions, setSuggestions] = useState<IStartup[]>([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        const results = await getSearchSuggestions(searchQuery)
        setSuggestions(results)
      } else {
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [searchQuery])

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for startups by city or industry"
          className="pl-10 pr-4 py-3 w-full text-lg rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 divide-y divide-gray-200">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id || index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Link href={`/startup/${suggestion.id}`}>
                  <div onClick={() => setSearchQuery(suggestion.name)}>
                    <div className="font-bold">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">
                      {suggestion.location}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}