import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

export default function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
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
      </div>
    </div>
  )
}