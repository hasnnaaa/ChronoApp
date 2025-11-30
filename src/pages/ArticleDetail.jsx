// src/pages/ArticleDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, User, ArrowLeft, Clock, Bookmark, Heart } from 'lucide-react'
import toast from "react-hot-toast";
import CommentSection from '../components/CommentSection'

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  // Interaksi artikel
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  // Data user
  const userStr = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil artikel
        const resArt = await fetch(`/api/articles/${id}`)
        if (!resArt.ok) throw new Error()
        const dataArt = await resArt.json()

        setArticle(dataArt)
        setLikesCount(dataArt.likes_count || 0)

        // Jika user login → cek status like & bookmark
        if (user && token) {
          const resBook = await fetch(`/api/bookmarks/status/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const dataBook = await resBook.json()
          setIsBookmarked(dataBook.isBookmarked)

          const resLike = await fetch(`/api/likes/status/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const dataLike = await resLike.json()
          setIsLiked(dataLike.isLiked)
        }
      } catch (error) {
        toast.error("Gagal memuat artikel")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Toggle bookmark
  const handleBookmark = async () => {
    if (!user) return toast.error("Silakan login terlebih dahulu")

    const prevState = isBookmarked
    setIsBookmarked(!prevState)

    try {
      await fetch(`/api/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ articleId: id })
      })
    } catch {
      setIsBookmarked(prevState) // rollback
      toast.error("Gagal menyimpan bookmark")
    }
  }

  // Toggle like
  const handleLike = async () => {
    if (!user) return toast.error("Silakan login terlebih dahulu")

    const prevLiked = isLiked
    const prevCount = likesCount

    setIsLiked(!prevLiked)
    setLikesCount(prev => (prevLiked ? prev - 1 : prev + 1))

    try {
      const response = await fetch(`/api/likes/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ articleId: id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error()

      setIsLiked(data.liked)
    } catch {
      setIsLiked(prevLiked)
      setLikesCount(prevCount)
      toast.error("Gagal memberi like")
    }
  }

  if (loading) return <div className="text-center py-20">Memuat...</div>
  if (!article) return <div className="text-center py-20">404 Not Found</div>

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors px-4 py-2 hover:bg-slate-100 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isLiked
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
            <span className="text-xs font-bold">{likesCount}</span>
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-all ${
              isBookmarked
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block text-left">
        {article.category}
      </span>

      <h1 className="font-logo font-bold text-3xl md:text-5xl text-slate-900 mb-6 leading-tight text-left">
        {article.title}
      </h1>

      {/* Info penulis */}
      <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
          {article.profiles?.avatar_url ? (
            <img src={article.profiles.avatar_url} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-slate-500" />
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {article.profiles?.full_name || 'Penulis Chrono'}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.created_at).toLocaleDateString('id-ID')}
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> 5 min read
            </span>
          </div>
        </div>
      </div>

      {/* Cover */}
      {article.image_url && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-md bg-slate-50">
          <img src={article.image_url} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Konten Artikel */}
      <article
        className="prose prose-lg prose-slate max-w-none font-serif text-slate-800 leading-loose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <CommentSection articleId={id} />
    </div>
  )
}
