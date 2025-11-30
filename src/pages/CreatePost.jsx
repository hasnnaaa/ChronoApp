// src/pages/CreatePost.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Image as ImageIcon, X, CheckCircle, Upload } from 'lucide-react'
import toast from 'react-hot-toast' 
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export default function CreatePost() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Teknologi')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isImageSet, setIsImageSet] = useState(false)

  const categories = ["Teknologi", "Produktivitas", "Campus Life", "Fiksi", "Self-Improvement", "Review"]

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const handleSetImage = () => {
    if (!imageUrl) return toast.error("Masukkan link gambar dulu!")
    setIsImageSet(true)
  }

  const handleRemoveImage = () => {
    setImageUrl('')
    setIsImageSet(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error("Sesi habis, silakan login lagi.")
      return navigate('/login')
    }

    const plainText = content.replace(/<[^>]+>/g, '') 
    const excerpt = plainText.substring(0, 150) + "..."

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, category, content, image_url: imageUrl, excerpt })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Gagal posting")

      toast.success("Artikel berhasil diterbitkan! 🎉")
      navigate('/') 
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 pb-24"> {/* Container dirampingkan (max-w-4xl) & padding mobile */}
      
      <div className="mb-8 md:mb-10 text-center">
        <h1 className="font-logo font-bold text-3xl md:text-4xl mb-2 text-slate-900">New Story.</h1>
        <p className="text-sm md:text-base text-slate-500">Mulai menulis ide brilianmu hari ini.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        {/* INPUT GAMBAR */}
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">Sampul Artikel</label>
          
          {!isImageSet ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl md:rounded-2xl p-6 md:p-10 text-center hover:border-pastel-clay hover:bg-pastel-peach/10 transition-all group">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-pastel-peach/30 text-pastel-clay rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="w-full">
                  <p className="text-base md:text-lg font-medium text-slate-700">Paste URL Gambar</p>
                  
                  <div className="mb-4 space-y-1">
                    <p className="text-xs md:text-sm text-slate-400">Gunakan direct link (.jpg, .png).</p>
                    <p className="text-[10px] md:text-xs text-rose-500 font-medium italic mt-1">
                      *Disarankan gambar landscape (16:9).
                    </p>
                  </div>

                  {/* Input URL Responsif */}
                  <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-pastel-clay focus:outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleSetImage}
                      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-md bg-slate-100">
              <img 
                src={imageUrl} 
                alt="Cover Preview" 
                className="w-full h-full object-cover"
                onError={() => toast.error("Link gambar rusak!")}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-white text-red-500 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-red-50 transition-transform hover:scale-105 text-sm"
                >
                  <X className="w-4 h-4" /> Ganti Gambar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JUDUL & KATEGORI */}
        <div className="space-y-4 md:space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Artikel..."
            className="w-full text-3xl md:text-5xl font-bold font-logo text-slate-900 placeholder-slate-300 border-none outline-none bg-transparent py-2 md:py-4 leading-tight"
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider">Kategori:</label>

            <div className="relative group w-full sm:w-auto">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-pastel-peach/30 text-slate-800 font-bold text-sm px-5 py-2.5 pr-10 rounded-full border border-transparent hover:border-pastel-clay focus:outline-none focus:ring-2 focus:ring-pastel-clay cursor-pointer transition-all w-full sm:w-auto"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pastel-clay">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* EDITOR */}
        <div className="min-h-[300px] md:min-h-[400px]">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            placeholder="Tulis ceritamu di sini..."
            className="h-[250px] md:h-[350px] font-serif text-base md:text-lg"
          />
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-end border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-slate-800 transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
            {loading ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
          </button>
        </div>

      </form>
    </div>
  )
}