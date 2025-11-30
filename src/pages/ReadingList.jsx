// src/pages/ReadingList.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ReadingList() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return navigate('/login')
      }

      try {
        const response = await fetch(`/api/bookmarks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data")
        }

        const data = await response.json();
        setBookmarks(data);

      } catch (error) {
        console.error("Gagal koneksi API:", error);
        toast.error("Gagal memuat daftar bacaan.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [navigate])

  const removeBookmark = async (bookmarkId) => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-medium text-slate-800 mb-4">
            Hapus cerita ini dari daftar bacaan?
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
                try {
                  const token = localStorage.getItem('token')
                  if (!token) return toast.error("Sesi habis, login lagi.")

                  const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });

                  if (response.ok) {
                    setBookmarks(prev => prev.filter(item => item.id !== bookmarkId));
                    toast.success("Berhasil dihapus.")
                  } else {
                    toast.error("Gagal menghapus.")
                  }
                } catch (error) {
                  toast.error("Terjadi kesalahan koneksi.")
                }
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    )
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Memuat daftar bacaan...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 md:mb-10">
        <div className="p-2 md:p-3 bg-black text-white rounded-xl">
          <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="font-logo font-bold text-2xl md:text-3xl text-slate-900">Reading List</h1>
          <p className="text-slate-500 text-xs md:text-sm">Koleksi cerita yang kamu simpan.</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6">
        {bookmarks.length > 0 ? (
          bookmarks.map((item) => {
            const article = item.articles 
            if (!article) return null 

            return (
              <div 
                key={item.id} 
                className="flex flex-col md:flex-row bg-white border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-md transition-all group"
              >
                
                {/* Gambar */}
                <div className="w-full md:w-64 aspect-video bg-slate-100 shrink-0 relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                </div>

                {/* Konten */}
                <div className="p-4 md:p-6 flex-1 flex flex-col justify-center">
                  <Link to={`/read/${article.id}`}>
                    <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-1">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-slate-50">
                    <span className="text-[10px] md:text-xs text-slate-400">
                      Disimpan pada {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    
                    <div className="flex gap-3 md:gap-4">
                      <button 
                        onClick={() => removeBookmark(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-xs md:text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Hapus
                      </button>
                      <Link 
                        to={`/read/${article.id}`} 
                        className="text-blue-600 font-bold text-xs md:text-sm flex items-center gap-1 hover:underline"
                      >
                        Baca <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-16 md:py-20 bg-slate-50 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200">
            <Bookmark className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mx-auto mb-3 md:mb-4" />
            <p className="text-slate-500 mb-4 text-sm md:text-base">Belum ada cerita yang disimpan.</p>
            <Link to="/" className="px-5 py-2 md:px-6 md:py-2 bg-black text-white rounded-full text-xs md:text-sm font-bold hover:bg-slate-800 transition-colors">
              Jelajahi Cerita
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}