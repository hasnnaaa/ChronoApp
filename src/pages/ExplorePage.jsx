// src/pages/ExplorePage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Compass, Hash } from 'lucide-react'

export default function ExplorePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    "Teknologi", "Produktivitas", "Campus Life", 
    "Fiksi", "Self-Improvement", "Review"
  ]

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* 1. Navigasi Topik Horizontal (Pills) */}
        <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-16 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs md:text-sm font-medium text-slate-900 shrink-0 hover:bg-slate-200 transition-colors">
             <Compass className="w-3 h-3 md:w-4 md:h-4" /> Explore topics
          </button>
          <div className="h-5 w-px bg-slate-200 shrink-0"></div>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => navigate(`/search?q=${cat}`)}
              className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs md:text-sm font-medium whitespace-nowrap hover:bg-slate-100 transition-colors shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. Header Besar (Responsif) */}
        <div className="text-center mb-8 md:mb-12">
            <h1 className="font-logo font-bold text-4xl md:text-7xl text-slate-900 mb-2 md:mb-4 tracking-tight">
                Explore topics
            </h1>
        </div>

        {/* 3. Search Bar Besar (Responsif) */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-20">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="block w-full pl-12 md:pl-16 pr-6 py-3 md:py-5 bg-slate-50 border-none text-slate-900 placeholder-slate-400 text-base md:text-lg rounded-full focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
                    placeholder="Search all topics"
                />
            </div>
        </div>

        {/* 4. Rekomendasi di Bawah */}
        <div className="text-center">
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest mb-4 md:mb-6">Recommended Topics</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto">
                {categories.slice(0, 5).map(cat => (
                    <button 
                        key={cat}
                        onClick={() => navigate(`/search?q=${cat}`)}
                        className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-slate-100 rounded-lg text-slate-700 text-sm md:text-base font-medium hover:bg-slate-200 transition-all"
                    >
                        <Hash className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                        {cat}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}