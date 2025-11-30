// src/pages/EditProfile.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Save, User, Camera } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function EditProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // State Form
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error("Silakan login dulu.")
        return navigate('/login')
      }

      try {
        const response = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()

        if (response.ok) {
          setFullName(data.full_name || '')
          setUsername(data.username || '')
          setBio(data.bio || '')
          setAvatarUrl(data.avatar_url || '')
        } else {
          toast.error("Gagal memuat data profil.")
        }
      } catch (error) {
        toast.error("Gagal terhubung ke server.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl
        })
      })

      if (!response.ok) throw new Error("Gagal update profil")
      
      toast.success('Profil berhasil diperbarui!')

      const oldUser = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({ 
        ...oldUser, 
        name: fullName, 
        avatar: avatarUrl 
      }))

      navigate('/profile')
      window.location.reload() 
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Memuat data...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-10 pb-24">
      <h1 className="font-logo font-bold text-2xl md:text-3xl mb-6 md:mb-8 text-center text-slate-900">
        Edit Profil
      </h1>

      <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Avatar Preview & Input */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-5 text-slate-300" />
              )}
            </div>
            
            <div className="w-full max-w-sm">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block text-center">
                URL Foto Profil
              </label>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all">
                <Camera className="w-4 h-4 text-slate-400" />
                <input 
                  type="url" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-transparent w-full text-xs md:text-sm outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                Gunakan link gambar langsung (jpg/png).
              </p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                placeholder="Nama Kamu"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                disabled 
                className="w-full px-4 py-2.5 border border-slate-200 bg-slate-100 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Bio Singkat</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:bg-white outline-none resize-none transition-all"
              placeholder="Ceritakan sedikit tentang dirimu..."
            />
            <p className="text-right text-[10px] text-slate-400 mt-1">{bio.length}/150</p>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full md:flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-bold text-sm rounded-full hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full md:flex-1 px-6 py-3 bg-black text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Simpan Profil
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}