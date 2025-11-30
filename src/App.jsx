// src/App.jsx
import { useState } from 'react' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import CreatePost from './pages/CreatePost'
import ArticleDetail from './pages/ArticleDetail'
import Profile from './pages/Profile'
import EditPost from './pages/EditPost'
import ReadingList from './pages/ReadingList'
import EditProfile from './pages/EditProfile'
import BottomNav from './components/BottomNav'
import SplashScreen from './components/SplashScreen'
import SearchPage from './pages/SearchPage'
import ExplorePage from './pages/ExplorePage'
import { Toaster } from 'react-hot-toast'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <> 
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#fdfcfb] to-[#fcfaf8] text-slate-900 font-sans pb-20 md:pb-0">
            <Toaster position="top-center" reverseOrder={false} />

            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/write" element={<CreatePost />} />
                <Route path="/read/:id" element={<ArticleDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit/:id" element={<EditPost />} />
                <Route path="/bookmarks" element={<ReadingList />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/explore" element={<ExplorePage />} />
              </Routes>
            </main>
            
            <BottomNav />
          </div>
        </Router>
      )}
    </> 
  )
}

export default App