
import React, { useState, useCallback } from 'react';
import { getMovieRecommendations } from './services/geminiService';
import { RecommendationResponse, AppStatus } from './types';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    try {
      const results = await getMovieRecommendations(query);
      setData(results);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An unexpected cinematic error occurred.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 selection:bg-cyan-500/30">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-700/50 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                <i className="fa-solid fa-clapperboard text-cyan-500 text-xl"></i>
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              CINE<span className="text-cyan-500">MATCH</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="text-cyan-500/50 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Live AI Search Enabled
            </span>
          </div>
        </div>
      </nav>

      {/* Hero / Search Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 underline decoration-cyan-500/30">exact</span> movie<br />
            for your mood.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Powered by Gemini with real-time web search for official posters and up-to-date ratings.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={status === AppStatus.LOADING} />

        {/* Results Area */}
        <div className="mt-16">
          {status === AppStatus.LOADING && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-slow"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Scouring the Cinema Web...</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Retrieving official posters and critics' data via Google Search.</p>
              </div>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">Search Interrupted</h3>
              <p className="text-red-300/80 mb-6">{error}</p>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20"
              >
                Retry Search
              </button>
            </div>
          )}

          {status === AppStatus.SUCCESS && data && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-6">
                <div className="shrink-0 w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-wand-magic-sparkles text-cyan-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-1">AI Curated Insight</h4>
                  <p className="text-slate-200 text-lg font-medium">"{data.intro}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {data.movies.map((movie, index) => (
                  <MovieCard key={`${movie.title}-${index}`} movie={movie} />
                ))}
              </div>

              {/* Grounding Sources */}
              {data.groundingChunks && data.groundingChunks.length > 0 && (
                <div className="pt-12 border-t border-slate-800">
                  <h5 className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-link text-[10px]"></i>
                    Search Grounding Sources
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {data.groundingChunks.map((chunk, i) => chunk.web && (
                      <a 
                        key={i}
                        href={chunk.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-4 py-2 rounded-full text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all flex items-center gap-2"
                      >
                        <img src={`https://www.google.com/s2/favicons?domain=${new URL(chunk.web.uri).hostname}`} alt="" className="w-3 h-3" />
                        <span className="max-w-[150px] truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-center pt-8">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-slate-600 hover:text-cyan-500 transition-colors flex items-center gap-2 mx-auto text-xs font-bold uppercase tracking-widest"
                >
                  <i className="fa-solid fa-chevron-up"></i>
                  Back to Search
                </button>
              </div>
            </div>
          )}

          {status === AppStatus.IDLE && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/10 border border-dashed border-slate-700/50 rounded-2xl aspect-[2/3] flex flex-col items-center justify-center p-12 text-center">
                   <i className="fa-solid fa-film text-slate-700 text-5xl mb-6"></i>
                   <div className="w-full h-3 bg-slate-800 rounded-full mb-3"></div>
                   <div className="w-2/3 h-3 bg-slate-800 rounded-full"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-900 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                <i className="fa-solid fa-film text-cyan-500 text-[10px]"></i>
              </div>
              <span className="text-sm font-bold text-slate-500 tracking-tighter">CINEMATCH AI</span>
          </div>
          <p className="text-slate-600 text-xs text-center max-w-sm">
            Movie recommendations are generated by Gemini Flash using Google Search grounding for real-time accuracy and poster retrieval.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
