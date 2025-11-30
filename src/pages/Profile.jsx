// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Clock, Edit2, Trash2, Settings, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [myArticles, setMyArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        return navigate('/login')
      }

      try {
        const resProfile = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const dataProfile = await resProfile.json()
        setProfile(dataProfile)

        const resArticles = await fetch('/api/articles/my-articles', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const dataArticles = await resArticles.json()
        setMyArticles(dataArticles)

      } catch (error) {
        toast.error("Gagal memuat profil.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleLogout = () => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-medium text-slate-800 mb-4">
            Yakin ingin keluar dari akun?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Batal
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={() => {
                toast.dismiss(t.id)
                localStorage.clear()
                navigate('/login')
                toast.success("Berhasil Logout")
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    )
  }

  const handleDelete = async (articleId) => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-medium text-slate-800 mb-4">
            Yakin mau menghapus cerita ini?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Batal
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={async () => {
                toast.dismiss(t.id)
                const token = localStorage.getItem('token')
                try {
                  const res = await fetch(`/api/articles/${articleId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (res.ok) {
                    setMyArticles(prev => prev.filter(art => art.id !== articleId))
                    toast.success("Cerita dihapus.")
                  } else {
                    toast.error("Gagal hapus.")
                  }
                } catch {
                  toast.error("Error koneksi.")
                }
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      ), { duration: 4000 }
    )
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Memuat profil...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 pb-24">
      
      {/* HEADER PROFIL */}
      <div className="relative mb-10 md:mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 rounded-3xl transform rotate-1 hidden md:block"></div>
        
        <div className="relative bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
          
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white border-2 border-slate-100 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
              {profile?.avatar_url 
                ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> 
                : <User className="w-full h-full p-5 text-slate-300" />}
            </div>
          </div>

          {/* Info User */}
          <div className="flex-1 space-y-1 md:space-y-2">
            <h1 className="font-logo font-bold text-2xl md:text-4xl text-slate-900">
              {profile?.full_name || "User"}
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">@{profile?.username}</p>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto md:mx-0 mt-2 italic">
              "{profile?.bio || 'Belum ada bio.'}"
            </p>
          </div>

          {/* Stats & Buttons */}
          <div className="flex flex-col items-center gap-3 md:gap-4 w-full md:w-auto">
             <div className="text-center bg-slate-50 px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 w-full md:w-auto">
                <span className="block text-xl md:text-2xl font-black text-slate-900">{myArticles.length}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stories</span>
             </div>
             
             <div className="flex gap-2 w-full md:w-auto">
                <Link 
                    to="/edit-profile" 
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs md:text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                    <Settings className="w-3 h-3 md:w-4 md:h-4" /> Edit
                </Link>
                
                {/* TOMBOL LOGOUT KHUSUS MOBILE */}
                <button 
                    onClick={handleLogout}
                    className="md:hidden flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-slate-200 text-red-500 bg-red-50 rounded-full text-xs font-bold hover:bg-red-100 transition-all"
                >
                    <LogOut className="w-3 h-3" /> Keluar
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* LIST ARTIKEL */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold font-logo text-slate-900">Tulisan Saya</h2>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {myArticles.length > 0 ? (
          myArticles.map((article) => (
            <div 
              key={article.id} 
              className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white p-4 md:p-5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group hover:shadow-md"
            >
              <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                <img src={article.image_url} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <div className="text-slate-400 text-[10px] md:text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <Link to={`/read/${article.id}`}>
                  <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">{article.excerpt}</p>

                <div className="flex gap-4 pt-2 border-t border-slate-50 mt-auto">
                  <Link 
                    to={`/edit/${article.id}`} 
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Link>

                  <button 
                    onClick={() => handleDelete(article.id)} 
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 md:py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-4 text-sm">Kamu belum menulis cerita apapun.</p>
            <Link 
              to="/write" 
              className="bg-black text-white px-5 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-slate-800 transition-colors"
            >
              Mulai Menulis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}