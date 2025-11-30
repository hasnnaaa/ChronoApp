// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Heart, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import heroBg from "../assets/hero-bg.jpg";

export default function Home() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", "Teknologi", "Produktivitas", "Campus Life", "Fiksi", "Self-Improvement",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();

        if (data) {
          setLatestArticles(data);
          const popular = [...data]
            .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
            .slice(0, 3);
          setPopularArticles(popular);
        }
      } catch (error) {
        toast.error("Gagal mengambil data dari server");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredArticles = selectedCategory === "All"
      ? latestArticles
      : latestArticles.filter((art) => art.category === selectedCategory);

  if (loading) return <div className="text-center py-32 text-slate-400">Memuat inspirasi...</div>;

  return (
    <div className="space-y-12 md:space-y-16 pb-24 md:pb-20 px-4 md:px-0">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-black rounded-2xl md:rounded-3xl overflow-hidden text-white shadow-xl md:shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

        <div className="relative z-10 max-w-4xl py-12 px-6 md:py-20 md:px-16 text-center md:text-left">
          <span className="inline-block py-1 px-3 md:py-1.5 md:px-4 rounded-full bg-white/20 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-6 border border-white/10 shadow-lg">
            Your Story Matters
          </span>

          <h1 className="font-logo font-bold text-3xl md:text-6xl mb-4 md:mb-6 leading-tight drop-shadow-lg">
            Bagikan Cerita, <br className="hidden md:block" /> Temukan Inspirasi.
          </h1>

          <p className="text-white/90 text-sm md:text-xl mb-6 md:mb-8 leading-relaxed max-w-xl drop-shadow-md font-light mx-auto md:mx-0">
            Chrono adalah tempat di mana ide-ide bertemu dengan tulisan yang bermakna. Mulai dari teknologi hingga kehidupan kampus.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
            <Link to="/write" className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black rounded-full font-bold text-sm md:text-base hover:bg-slate-200 transition-all shadow-xl text-center">
              Mulai Menulis
            </Link>
            <a href="#explore" className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-white/30 text-white rounded-full font-bold text-sm md:text-base hover:bg-white/10 transition-all hover:border-white text-center">
              Jelajahi
            </a>
          </div>
        </div>
      </div>

      {/* 2. POPULAR STORIES */}
      {popularArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
            <h2 className="font-logo font-bold text-xl md:text-2xl text-slate-900">
              Sedang Populer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {popularArticles.map((article, idx) => (
              <Link to={`/read/${article.id}`} key={article.id} className="group relative block bg-white rounded-xl md:bg-transparent md:rounded-none p-4 md:p-0 border md:border-none border-slate-100 shadow-sm md:shadow-none">
                <div className="absolute -left-2 -top-4 md:-left-4 md:-top-6 text-6xl md:text-8xl font-black text-pastel-300 z-0 select-none">
                  0{idx + 1}
                </div>

                <div className="relative z-10">
                  <div className="aspect-video md:aspect-[4/3] rounded-lg md:rounded-2xl overflow-hidden mb-3 md:mb-4 shadow-sm bg-slate-100">
                    <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-500 mb-1 md:mb-2 uppercase tracking-wider">
                    <span className="text-blue-600">{article.category}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-bold text-lg md:text-xl text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-1 md:mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Heart className="w-3 h-3 fill-slate-300 text-slate-300" /> {article.likes_count || 0} Likes
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. EXPLORE SECTION */}
      <section id="explore">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 border-b border-slate-200 pb-4">
          <h2 className="font-logo font-bold text-xl md:text-2xl text-slate-900">
            Jelajahi Cerita
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link 
                to={`/read/${article.id}`} 
                key={article.id} 
                className="group flex flex-col h-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100 relative shadow-sm">
                  <img 
                    src={article.image_url} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-200 overflow-hidden">
                      {article.profiles?.avatar_url ? (
                        <img src={article.profiles.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-1 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-700">
                      {article.profiles?.full_name || "Penulis"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 md:mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 text-xs md:text-sm line-clamp-3 mb-3 md:mb-4 flex-1 leading-relaxed hidden sm:block">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100 text-[10px] md:text-xs text-slate-400 font-medium mt-auto">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 uppercase tracking-wide font-bold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 md:py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 mb-4 text-sm md:text-base">Belum ada artikel di kategori ini.</p>
              <Link to="/write" className="text-black font-bold hover:underline text-sm md:text-base">
                Jadilah yang pertama menulis!
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}