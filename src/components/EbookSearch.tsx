import React, { useState } from 'react';
import { Search, Download, BookOpen, ExternalLink, Loader } from 'lucide-react';

interface EbookSearchProps {
  onBookSelect: (book: any, content: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  author: string;
  description: string;
  downloadUrl: string;
  format: string;
  source: string;
  coverUrl?: string;
}

const EbookSearch: React.FC<EbookSearchProps> = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Mock search function - in a real app, this would call actual APIs
  const searchBooks = async (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock results from various free ebook sources
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A classic romance novel about Elizabeth Bennet and Mr. Darcy.',
        downloadUrl: 'https://www.gutenberg.org/files/1342/1342-0.txt',
        format: 'TXT',
        source: 'Project Gutenberg',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A tale of the Jazz Age and the American Dream.',
        downloadUrl: 'https://www.gutenberg.org/files/64317/64317-0.txt',
        format: 'TXT',
        source: 'Project Gutenberg',
        coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Alice\'s Adventures in Wonderland',
        author: 'Lewis Carroll',
        description: 'Follow Alice down the rabbit hole into a world of wonder.',
        downloadUrl: 'https://www.gutenberg.org/files/11/11-0.txt',
        format: 'TXT',
        source: 'Project Gutenberg',
        coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop'
      },
      {
        id: '4',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        description: 'The classic Gothic novel about Victor Frankenstein and his creature.',
        downloadUrl: 'https://www.gutenberg.org/files/84/84-0.txt',
        format: 'TXT',
        source: 'Project Gutenberg',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop'
      },
      {
        id: '5',
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        description: 'Classic detective stories featuring the famous Sherlock Holmes.',
        downloadUrl: 'https://www.gutenberg.org/files/1661/1661-0.txt',
        format: 'TXT',
        source: 'Project Gutenberg',
        coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop'
      }
    ].filter(book => 
      query.length === 0 || 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchBooks(searchQuery.trim());
    }
  };

  const downloadBook = async (book: SearchResult) => {
    setDownloadingId(book.id);
    
    try {
      const response = await fetch(book.downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to download book');
      }
      
      const content = await response.text();
      
      // Save to localStorage for library
      const savedBooks = JSON.parse(localStorage.getItem('ebookLibrary') || '[]');
      const bookData = {
        ...book,
        content,
        dateAdded: new Date().toISOString()
      };
      
      const existingIndex = savedBooks.findIndex((b: any) => b.id === book.id);
      if (existingIndex >= 0) {
        savedBooks[existingIndex] = bookData;
      } else {
        savedBooks.push(bookData);
      }
      
      localStorage.setItem('ebookLibrary', JSON.stringify(savedBooks));
      
      // Load the book
      onBookSelect(book, content);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download book. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="border-b border-gray-100 p-6 bg-emerald-50">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-800">Find Free Ebooks</h3>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books, authors, or topics..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Search Results ({searchResults.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {searchResults.map((book) => (
              <div key={book.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-800 text-sm truncate">{book.title}</h5>
                    <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{book.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.source}</span>
                      <button
                        onClick={() => downloadBook(book)}
                        disabled={downloadingId === book.id}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs rounded font-medium transition-colors"
                      >
                        {downloadingId === book.id ? (
                          <Loader className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        Read
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
        <h4 className="font-medium text-gray-700 mb-2">Free Ebook Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-500" />
            <span>Project Gutenberg - Classic literature</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-green-500" />
            <span>Internet Archive - Diverse collection</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-purple-500" />
            <span>Open Library - Modern & classic books</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookSearch;