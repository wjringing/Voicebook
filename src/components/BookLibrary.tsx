import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, Calendar, User, FileText } from 'lucide-react';

interface BookLibraryProps {
  onBookSelect: (book: any, content: string) => void;
}

interface SavedBook {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  dateAdded: string;
  format: string;
  source: string;
  coverUrl?: string;
}

const BookLibrary: React.FC<BookLibraryProps> = ({ onBookSelect }) => {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

  useEffect(() => {
    loadSavedBooks();
  }, []);

  const loadSavedBooks = () => {
    const books = JSON.parse(localStorage.getItem('ebookLibrary') || '[]');
    setSavedBooks(books);
  };

  const removeBook = (bookId: string) => {
    const updatedBooks = savedBooks.filter(book => book.id !== bookId);
    setSavedBooks(updatedBooks);
    localStorage.setItem('ebookLibrary', JSON.stringify(updatedBooks));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).length.toLocaleString();
  };

  return (
    <div className="border-b border-gray-100 p-6 bg-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">My Library</h3>
        <span className="text-sm text-gray-500">({savedBooks.length} books)</span>
      </div>

      {savedBooks.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Your library is empty</p>
          <p className="text-sm text-gray-400">Search and download books to build your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {savedBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-800 text-sm truncate mb-1">{book.title}</h5>
                  <div className="flex items-center gap-1 mb-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-600 truncate">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">Added {formatDate(book.dateAdded)}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{getWordCount(book.content)} words</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {book.format}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onBookSelect(book, book.content)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded font-medium transition-colors"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => removeBook(book.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove from library"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Library Stats */}
      {savedBooks.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Library Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">{savedBooks.length}</div>
              <div className="text-gray-500">Books</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">
                {savedBooks.reduce((total, book) => total + getWordCount(book.content).replace(/,/g, ''), 0).toLocaleString()}
              </div>
              <div className="text-gray-500">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">
                {new Set(savedBooks.map(book => book.author)).size}
              </div>
              <div className="text-gray-500">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">
                {new Set(savedBooks.map(book => book.source)).size}
              </div>
              <div className="text-gray-500">Sources</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookLibrary;