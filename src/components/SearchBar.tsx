import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  placeholder = "Buscar treinos, exercícios ou grupos musculares..."
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10 pr-10 transition-all duration-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <motion.button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </motion.button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;