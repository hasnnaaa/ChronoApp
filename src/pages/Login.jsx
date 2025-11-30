// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import toast from "react-hot-toast"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  // State Form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    const endpoint = isSignUp 
      ? '/api/auth/register' 
      : '/api/auth/login'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName: isSignUp ? fullName : undefined,
          username: isSignUp ? username : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan")

      // ===== LOGIN =====
      if (!isSignUp) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        toast.success("Login berhasil! 🚀")
        navigate('/')
        window.location.reload()
      } 

      // ===== REGISTER =====
      else {
        toast.success("Registrasi berhasil! Silakan login.")
        setIsSignUp(false)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-10">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        
        <div className="text-center mb-8">
          <h1 className="font-logo font-bold text-4xl mb-2">chrono.</h1>
          <p className="text-slate-500 text-sm tracking-wide uppercase">
            {isSignUp ? 'Join the Timeline' : 'Welcome Back'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2 mt-6">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignUp ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-black hover:underline">
            {isSignUp ? 'Login di sini' : 'Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>
  )
}
