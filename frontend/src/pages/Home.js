import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner, Alert } from '../components/ui';
import { searchMutualFunds } from '../services/api';
import debounce from 'lodash/debounce';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoComplete, setAutoComplete] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const searchContainerRef = useRef(null);

  // Debounced suggestions function
  const debouncedGetSuggestions = useCallback((term) => {
    const getSuggestions = debounce(async () => {
      if (!term.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const data = await searchMutualFunds(term);
        setSuggestions(data || []);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      }
    }, 25);
    
    getSuggestions();
    return getSuggestions.cancel;
  }, []);

  useEffect(() => {
    if (searchTerm && suggestions.length > 0) {
      const match = suggestions.find(s => s.schemeName.toLowerCase().startsWith(searchTerm.toLowerCase()));
      setAutoComplete(match ? match.schemeName : '');
    } else {
      setAutoComplete('');
    }
  }, [searchTerm, suggestions]);

  // Reset visibleCount when new search results are set
  useEffect(() => {
    setVisibleCount(30);
  }, [searchResults]);

  // Handle actual search
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Pass searchTerm (can be empty) to searchMutualFunds
      const data = await searchMutualFunds(searchTerm);
      setSearchResults(data || []);
      if (data.length === 0) {
        setError('No mutual funds found');
      }
    } catch (err) {
      setError('Failed to search mutual funds');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  // Get suggestions when typing
  useEffect(() => {
    const cancelSuggestions = debouncedGetSuggestions(searchTerm);
    return () => cancelSuggestions();
  }, [searchTerm, debouncedGetSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFundClick = (schemeCode) => {
    setShowSuggestions(false);
    navigate(`/fund/${schemeCode}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);

    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && autoComplete && autoComplete.toLowerCase() !== searchTerm.toLowerCase()) {
      e.preventDefault();
      setSearchTerm(autoComplete);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Search Mutual Funds
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Enter a mutual fund name or keyword to search
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3 relative mb-2" ref={searchContainerRef}>
            <div className="flex-grow relative">
              <div className="relative w-full overflow-hidden rounded-lg border border-gray-300 bg-white/80 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search mutual funds..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleInputKeyDown}
                  className="w-full px-4 py-2 bg-transparent outline-none"
                  autoComplete="off"
                  style={{ position: 'relative', zIndex: 2, background: 'transparent' }}
                />
                {autoComplete && autoComplete.toLowerCase() !== searchTerm.toLowerCase() && searchTerm && (
                  <div
                    className="absolute left-0 top-0 w-full h-full flex items-center px-4 py-2 pointer-events-none text-gray-400 select-none"
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      background: 'transparent',
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <span style={{ opacity: 0 }}>{searchTerm}</span>
                    <span>{autoComplete.slice(searchTerm.length)}</span>
                  </div>
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white/95 rounded-lg 
                  shadow-lg border border-gray-200 max-h-96 overflow-y-auto
                  backdrop-blur-sm transition-all duration-300 animate-fadeIn">
                  {suggestions.map((fund) => (
                    <div
                      key={fund.schemeCode}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b 
                        border-gray-100 last:border-b-0 transition-colors duration-200"
                      onClick={() => handleFundClick(fund.schemeCode)}
                    >
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {fund.schemeName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Scheme Code: {fund.schemeCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" isLoading={isLoading}>
              Search
            </Button>
          </form>

          {error && <Alert type="error" message={error} className="mt-4" />}

          {/* Search Results */}
          {searchResults.length > 0 && !isLoading && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <div className="space-y-4">
                {searchResults.slice(0, visibleCount).map((fund) => (
                  <div
                    key={fund.schemeCode}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleFundClick(fund.schemeCode)}
                  >
                    <h3 className="font-medium text-gray-900">{fund.schemeName}</h3>
                    <p className="mt-1 text-sm text-gray-500">Scheme Code: {fund.schemeCode}</p>
                  </div>
                ))}
              </div>
              {searchResults.length > visibleCount && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    onClick={() => setVisibleCount((c) => c + 30)}
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
