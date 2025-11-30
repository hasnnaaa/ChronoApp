import { useState, useEffect } from 'react'
import { Send, Trash2, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // 1. Ambil User & Token dari LocalStorage
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')

  useEffect(() => {
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      // 2. Fetch Comments dari API
      const res = await fetch(`/api/comments/${articleId}`)
      const data = await res.json()
      setComments(data)
    } catch (err) { console.error(err) }
  }

  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setLoading(true)

    try {
      // 3. POST Comment ke API 
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          content: newComment, 
          articleId, 
          userId: currentUser.id 
        })
      })

      if (response.ok) {
        setNewComment('')
        fetchComments() 
      } else {
        alert("Gagal mengirim komentar")
      }
    } catch (err) { alert("Error koneksi") }
    
    setLoading(false)
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Hapus komentar ini?")) return

    try {
      // 4. DELETE Comment ke API 
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId))
      }
    } catch (err) { alert("Error koneksi") }
  }

  return (
    <div className="mt-16 border-t border-slate-100 pt-10">
      <h3 className="font-logo font-bold text-2xl mb-6">Diskusi ({comments.length})</h3>

      {/* INPUT KOMENTAR */}
      {currentUser ? (
        <form onSubmit={handlePostComment} className="flex gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
             {/* Avatar User Login */}
             {currentUser.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" />
             ) : (
                <User className="w-full h-full p-2 text-slate-500" />
             )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis tanggapanmu..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 focus:ring-2 focus:ring-black focus:outline-none resize-none h-24"
            />
            <button 
              type="submit" 
              disabled={loading || !newComment.trim()}
              className="absolute bottom-3 right-3 p-2 bg-black text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 p-6 rounded-xl text-center mb-10">
          <p className="text-slate-500 mb-2">Ingin bergabung dalam diskusi?</p>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">Login untuk berkomentar</Link>
        </div>
      )}

      {/* LIST KOMENTAR */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
              {comment.profiles?.avatar_url ? (
                <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-bold text-slate-900 mr-2">
                    {comment.profiles?.full_name || "Pengguna"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                {/* Tombol Hapus */}
                {currentUser?.id === comment.user_id && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}