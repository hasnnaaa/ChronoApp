// src/pages/SearchPage.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon, User, Clock, AlertCircle, ArrowLeft } from 'lucide-react'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        if (query) {
          const res = await fetch(`/api/articles/search?q=${query}`)
          const data = await res.json()
          setArticles(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 min-h-[80vh]">
      {/* Header dengan tombol kembali */}
      <div className="mb-8 md:mb-10">
        <Link 
          to="/explore" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Explore
        </Link>
        
        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">Hasil Pencarian</p>
        <h1 className="font-logo font-bold text-2xl md:text-4xl text-slate-900 flex items-center gap-2 md:gap-3">
          <SearchIcon className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
          "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Sedang mencari...</div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <Link to={`/read/${article.id}`} key={article.id} className="group flex flex-col h-full bg-white border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-video bg-slate-100 overflow-hidden relative">
                <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {article.category}
                </span>
              </div>
              
              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 pt-3 md:pt-4 border-t border-slate-50 mt-auto">
                  <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="truncate max-w-[100px]">{article.profiles?.full_name || 'Penulis'}</span>
                  <span className="mx-1">•</span>
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-20 bg-slate-50 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200">
          <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-2">Tidak ditemukan</h3>
          <p className="text-sm md:text-base text-slate-500">Coba gunakan kata kunci lain yang lebih umum.</p>
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 mt-6 text-pastel-clay hover:text-pastel-clay/80 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Explore
          </Link>
        </div>
      )}
    </div>
  )
}