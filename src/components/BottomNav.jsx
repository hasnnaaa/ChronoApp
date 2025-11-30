import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, PenSquare, Bookmark, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' }, 
    { icon: PenSquare, label: 'Write', path: '/write' },
    { icon: Bookmark, label: 'Saved', path: '/bookmarks' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const active = isActive(item.path)
          
          return (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
                active ? 'text-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Icon */}
              <item.icon 
                className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`} 
                strokeWidth={active ? 2.5 : 2}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.1 : 0} 
              />
              
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}