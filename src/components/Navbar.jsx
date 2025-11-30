import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, PenSquare, User, LogOut, Bookmark, Compass, X } from 'lucide-react'
import logoImg from '../assets/logo-c.png'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  // State Search
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) setUser(JSON.parse(userStr))

    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchFocused(false)
      navigate(`/search?q=${searchQuery}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pastel-sand/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 md:h-24"> 
          
          {/* BAGIAN KIRI: LOGO */}
          <Link to="/" className="flex items-center gap-3 group select-none flex-shrink-0">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="h-9 w-auto md:h-11 object-contain transform group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col justify-center">
              <h1 className="font-logo font-bold text-2xl md:text-3xl tracking-tight text-black leading-none">
                chrono.
              </h1>
              <span className="hidden md:block text-[10px] font-medium text-slate-600 tracking-[0.25em] uppercase mt-0.5">
                Timeline of Thoughts
              </span>
            </div>
          </Link>

          {/* BAGIAN KANAN: SEARCH DAN USER ACTIONS */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Bar - Hanya untuk Desktop */}
            <div className="hidden md:block relative ml-2" ref={searchRef}>
              <div className={`flex items-center bg-pastel-peach/30 px-3 py-2.5 rounded-full transition-all duration-300 ${isSearchFocused ? 'bg-white ring-2 ring-black/10 w-72 shadow-lg' : 'w-56 hover:bg-pastel-peach/40'}`}>
                <Search className={`w-5 h-5 ${isSearchFocused ? 'text-black' : 'text-slate-800'}`} />
                <input 
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-black placeholder-slate-600 font-medium outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                    <X className="w-3 h-3 text-black" />
                  </button>
                )}
              </div>

              {isSearchFocused && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
                  <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Explore</p>
                  <Link 
                    to="/explore" 
                    onClick={() => setIsSearchFocused(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-black transition-colors"
                  >
                    <Compass className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium">Explore topics</span>
                  </Link>
                </div>
              )}
            </div>

            {/* User Actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <Link to="/bookmarks" className="text-slate-800 hover:text-black transition-colors p-2 rounded-full hover:bg-slate-100" title="Reading List">
                  <Bookmark className="w-6 h-6" />
                </Link>
              )}
              
              <Link to="/write" className="flex items-center gap-2 text-slate-900 hover:text-black transition-colors font-semibold text-base hover:bg-slate-100 px-3 py-1.5 rounded-full">
                <PenSquare className="w-5 h-5" />
                <span className="hidden lg:inline">Write</span>
              </Link>

              {user ? (
                <div className="pl-3 border-l border-slate-300 ml-1 flex items-center gap-3">
                  <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 hover:opacity-80 transition-opacity border border-slate-200 shadow-sm">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-black" />}
                  </Link>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors p-1" title="Sign Out">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5">
                  Sign In
                </Link>
              )}
            </div>

            {/* Sign In Button - Mobile Only */}
            {!user && (
              <Link 
                to="/login" 
                className="md:hidden px-4 py-2 bg-black text-white rounded-full text-sm font-medium shadow-md hover:bg-slate-800 transition-all flex-shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}