
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  const suggestions = [
    "Mind-bending sci-fi like Inception",
    "Cozy animated movies for a rainy day",
    "Gritty 80s action classics",
    "Documentaries about deep space",
    "Dark psychological thrillers with a twist"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What kind of movie are you looking for?"
          className="w-full bg-slate-800/50 border-2 border-slate-700 text-white rounded-2xl py-5 px-14 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-lg placeholder:text-slate-500 glass"
          disabled={isLoading}
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
          <i className="fa-solid fa-magnifying-glass text-xl"></i>
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <>
              <span>Discover</span>
              <i className="fa-solid fa-arrow-right"></i>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setQuery(s)}
            className="text-xs bg-slate-800/40 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 px-3 py-1.5 rounded-full border border-slate-700 transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
