import React from 'react';
import { FileText } from 'lucide-react';

interface TextDisplayProps {
  text: string;
  onTextChange: (text: string) => void;
  currentPosition: number;
  isPlaying: boolean;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  onTextChange,
  currentPosition,
  isPlaying,
}) => {
  const highlightText = (text: string, position: number) => {
    if (!isPlaying || position === 0) {
      return <span>{text}</span>;
    }

    const before = text.substring(0, position);
    const current = text.substring(position, position + 50);
    const after = text.substring(position + 50);

    return (
      <span>
        <span className="text-gray-600">{before}</span>
        <span className="bg-yellow-200 text-gray-900 font-medium">{current}</span>
        <span>{after}</span>
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">Text Content</h3>
      </div>
      
      {text ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 min-h-96 max-h-96 overflow-y-auto">
            <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
              {highlightText(text, currentPosition)}
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>{text.length} characters</span>
            <span>{text.split(/\s+/).length} words</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your text here, or upload a text file to get started..."
            className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg leading-relaxed"
          />
          
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              📚 Perfect for reading books, articles, documents, and any text content
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextDisplay;