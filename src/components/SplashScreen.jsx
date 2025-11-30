// src/components/SplashScreen.jsx
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react' // Ikon loading bawaan
import logoImg from '../assets/logo-c.png'

export default function SplashScreen({ onComplete }) {
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // Tahan 2 detik, lalu mulai fade out
    const timer = setTimeout(() => {
      setFade(true)
      // Tunggu animasi fade selesai (0.5s), baru hilangkan total
      setTimeout(() => onComplete(), 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Logo + Animasi Denyut Halus */}
      <img 
        src={logoImg} 
        alt="Chrono Logo" 
        className="w-24 h-24 mb-4 object-contain animate-pulse" 
      />

      {/* Nama App */}
      <h1 className="font-logo font-bold text-3xl text-slate-900 tracking-tight mb-8">
        chrono.
      </h1>

      {/* Loading Putar Standar */}
      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
    </div>
  )
}