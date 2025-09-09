import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseEbook } from '../utils/ebookParser';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = [
      'text/plain',
      'application/epub+zip',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const supportedExtensions = ['.txt', '.epub', '.pdf', '.docx'];
    const isSupported = supportedTypes.includes(file.type) || 
                       supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isSupported) {
      parseEbook(file)
        .then(content => {
          onFileContent(content);
        })
        .catch(error => {
          console.error('Error parsing file:', error);
          alert('Error reading file. Please try a different format.');
        });
    } else {
      alert('Please select a supported file: TXT, EPUB, PDF, or DOCX');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.epub,.pdf,.docx,text/plain,application/epub+zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
      >
        <Upload className="h-4 w-4" />
        Upload Ebook
      </button>
    </>
  );
};

export default FileUpload;