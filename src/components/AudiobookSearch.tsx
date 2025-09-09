import React, { useState } from 'react';
import { Search, Play, Volume2, ExternalLink, Loader, Clock, Star } from 'lucide-react';

interface AudiobookSearchProps {
  onAudiobookSelect: (audiobook: any) => void;
}

interface AudiobookResult {
  id: string;
  title: string;
  author: string;
  narrator: string;
  description: string;
  duration: string;
  rating: number;
  streamUrl: string;
  downloadUrl?: string;
  source: string;
  coverUrl?: string;
  genre: string;
  publishYear: string;
}

const AudiobookSearch: React.FC<AudiobookSearchProps> = ({ onAudiobookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AudiobookResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - in a real app, this would call actual APIs
  const searchAudiobooks = async (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock results from various free audiobook sources
    const mockResults: AudiobookResult[] = [
      {
        id: 'ab1',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        narrator: 'Karen Savage',
        description: 'A timeless romance following Elizabeth Bennet and Mr. Darcy in Regency England.',
        duration: '11h 35m',
        rating: 4.6,
        streamUrl: 'https://archive.org/download/pride_prejudice_0711_librivox/prideprejudice_01_austen_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        genre: 'Romance',
        publishYear: '1813'
      },
      {
        id: 'ab2',
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        narrator: 'David Clarke',
        description: 'Classic detective stories featuring the brilliant Sherlock Holmes and Dr. Watson.',
        duration: '8h 52m',
        rating: 4.8,
        streamUrl: 'https://archive.org/download/adventures_sherlock_holmes_0711_librivox/adventuressherlock_01_doyle_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        genre: 'Mystery',
        publishYear: '1892'
      },
      {
        id: 'ab3',
        title: 'Alice\'s Adventures in Wonderland',
        author: 'Lewis Carroll',
        narrator: 'Kara Shallenberg',
        description: 'Follow Alice down the rabbit hole into a magical world of wonder and whimsy.',
        duration: '2h 44m',
        rating: 4.4,
        streamUrl: 'https://archive.org/download/alices_adventures_wonderland_0711_librivox/alicewonderland_01_carroll_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        genre: 'Fantasy',
        publishYear: '1865'
      },
      {
        id: 'ab4',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        narrator: 'Frank Marcopolos',
        description: 'A tale of the Jazz Age, the American Dream, and the dark side of wealth.',
        duration: '4h 49m',
        rating: 4.3,
        streamUrl: 'https://archive.org/download/great_gatsby_0809_librivox/gatsby_01_fitzgerald_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        genre: 'Classic',
        publishYear: '1925'
      },
      {
        id: 'ab5',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        narrator: 'B.J. Harrison',
        description: 'The classic Gothic novel about Victor Frankenstein and his monstrous creation.',
        duration: '8h 35m',
        rating: 4.5,
        streamUrl: 'https://archive.org/download/frankenstein_0809_librivox/frankenstein_01_shelley_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
        genre: 'Horror',
        publishYear: '1818'
      },
      {
        id: 'ab6',
        title: 'The Time Machine',
        author: 'H.G. Wells',
        narrator: 'Chip',
        description: 'A Victorian scientist travels through time to witness humanity\'s distant future.',
        duration: '3h 12m',
        rating: 4.2,
        streamUrl: 'https://archive.org/download/time_machine_0809_librivox/timemachine_01_wells_64kb.mp3',
        source: 'LibriVox',
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
        genre: 'Science Fiction',
        publishYear: '1895'
      }
    ].filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genre.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchAudiobooks(searchQuery.trim());
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="border-b border-gray-100 p-6 bg-orange-50">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">Find Free Audiobooks</h3>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for audiobooks, authors, or genres..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Audiobook Results ({searchResults.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {searchResults.map((audiobook) => (
              <div key={audiobook.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {audiobook.coverUrl && (
                    <img
                      src={audiobook.coverUrl}
                      alt={audiobook.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{audiobook.title}</h5>
                    <p className="text-xs text-gray-600 mb-1">by {audiobook.author}</p>
                    <p className="text-xs text-gray-500 mb-1">Narrated by {audiobook.narrator}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(audiobook.rating)}
                        <span className="text-xs text-gray-500 ml-1">{audiobook.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{audiobook.duration}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{audiobook.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{audiobook.genre}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{audiobook.source}</span>
                      </div>
                      <button
                        onClick={() => onAudiobookSelect(audiobook)}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded font-medium transition-colors"
                      >
                        <Play className="h-3 w-3" />
                        Listen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources Info */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Free Audiobook Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-orange-500" />
            <span>LibriVox - Volunteer narrated classics</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-500" />
            <span>Internet Archive - Vast audio collection</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-green-500" />
            <span>Loyal Books - Free public domain audiobooks</span>
          </div>
        </div>
        <div className="mt-3 p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> All audiobooks are from public domain sources and are completely free to stream and download.
            Quality may vary as they are often volunteer-narrated recordings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudiobookSearch;