
import React, { useState } from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imgError, setImgError] = useState(false);
  
  // High quality cinematic fallback if the specific URL fails
  const fallbackUrl = `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&h=600`;

  return (
    <div className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/20 border border-slate-700/50 flex flex-col h-full">
      <div className="aspect-[2/3] w-full overflow-hidden bg-slate-900 relative">
        <img 
          src={imgError ? fallbackUrl : (movie.posterUrl || fallbackUrl)} 
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1.5 text-sm font-bold text-yellow-400 z-10">
          <i className="fa-solid fa-star"></i>
          {movie.rating}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{movie.title}</h3>
          <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">{movie.year}</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {movie.genre.map((g, i) => (
            <span key={i} className="text-[9px] uppercase tracking-wider font-bold bg-cyan-950/50 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded">
              {g}
            </span>
          ))}
        </div>

        <p className="text-slate-300 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
          {movie.description}
        </p>

        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-sparkles text-cyan-500 text-[10px]"></i>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match Analysis</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "{movie.reasoning}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
