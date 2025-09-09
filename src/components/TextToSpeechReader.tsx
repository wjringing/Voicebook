import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Upload, Volume2, Settings, BookOpen, Search, Download } from 'lucide-react';
import FileUpload from './FileUpload';
import VoiceControls from './VoiceControls';
import TextDisplay from './TextDisplay';
import EbookSearch from './EbookSearch';
import BookLibrary from './BookLibrary';
import AudiobookSearch from './AudiobookSearch';
import AudiobookPlayer from './AudiobookPlayer';

interface Voice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  gender: string;
}

const TextToSpeechReader: React.FC = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAudiobooks, setShowAudiobooks] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isPlayingAudiobook, setIsPlayingAudiobook] = useState(false);
  const [currentAudiobook, setCurrentAudiobook] = useState<any>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textChunks = useRef<string[]>([]);
  const currentChunkIndex = useRef(0);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const processedVoices: Voice[] = voices
        .filter(voice => voice.lang.startsWith('en'))
        .map(voice => ({
          voice,
          name: voice.name,
          lang: voice.lang,
          gender: voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') ? 'Female' : 
                 voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man') ? 'Male' : 'Unknown'
        }));
      
      setAvailableVoices(processedVoices);
      if (processedVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(processedVoices[0].voice);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  const chunkText = (text: string): string[] => {
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= 200) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.filter(chunk => chunk.length > 0);
  };

  const speakChunk = (chunkIndex: number) => {
    if (chunkIndex >= textChunks.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      return;
    }

    const chunk = textChunks.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setCurrentPosition(textChunks.current.slice(0, chunkIndex).join(' ').length);
    };

    utterance.onend = () => {
      currentChunkIndex.current = chunkIndex + 1;
      setProgress(((chunkIndex + 1) / textChunks.current.length) * 100);
      
      if (currentChunkIndex.current < textChunks.current.length) {
        setTimeout(() => speakChunk(currentChunkIndex.current), 100);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!text.trim()) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.cancel();
      textChunks.current = chunkText(text);
      currentChunkIndex.current = 0;
      setProgress(0);
      speakChunk(0);
    }
    
    setIsPlaying(true);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
    setProgress(0);
    currentChunkIndex.current = 0;
  };

  const handleFileContent = (content: string) => {
    setText(content);
    handleStop();
    setCurrentBook(null);
  };

  const handleBookSelect = (book: any, content: string) => {
    setText(content);
    setCurrentBook(book);
    handleStop();
    setShowSearch(false);
    setShowLibrary(false);
    setShowAudiobooks(false);
    setCurrentAudiobook(null);
    setIsPlayingAudiobook(false);
  };

  const handleAudiobookSelect = (audiobook: any) => {
    setCurrentAudiobook(audiobook);
    setText(''); // Clear text when playing audiobook
    handleStop(); // Stop TTS
    setShowAudiobooks(false);
    setShowSearch(false);
    setShowLibrary(false);
    setCurrentBook(null);
    setShowAudiobooks(false);
    setCurrentAudiobook(null);
    setIsPlayingAudiobook(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">EbookVoice</h1>
          </div>
          <p className="text-lg text-gray-600">Read ebooks, audiobooks, and text with lifelike AI voices</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Controls Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full font-medium transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-full font-medium transition-colors"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </button>
              </div>

              <div className="flex items-center gap-3">
                <FileUpload onFileContent={handleFileContent} />
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Find Books
                </button>
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Library
                </button>
                <button
                  onClick={() => setShowAudiobooks(!showAudiobooks)}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  Audiobooks
                </button>
                <button
                  onClick={() => setShowAudiobooks(!showAudiobooks)}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  Audiobooks
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Voice
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {(isPlaying || isPaused || progress > 0) && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Reading Progress</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Book Info */}
          {(currentBook || currentAudiobook) && (
            <div className="border-b border-gray-100 p-4 bg-blue-50">
              <div className="flex items-center gap-3">
                {currentAudiobook ? (
                  <Volume2 className="h-5 w-5 text-orange-600" />
                ) : (
                  <BookOpen className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {currentAudiobook ? currentAudiobook.title : currentBook.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {currentAudiobook ? currentAudiobook.author : currentBook.author}
                  </p>
                  {currentAudiobook && (
                    <p className="text-xs text-orange-600 font-medium">Audiobook</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ebook Search */}
          {showSearch && (
            <EbookSearch onBookSelect={handleBookSelect} />
          )}

          {/* Book Library */}
          {showLibrary && (
            <BookLibrary onBookSelect={handleBookSelect} />
          )}

          {/* Audiobook Search */}
          {showAudiobooks && (
            <AudiobookSearch onAudiobookSelect={handleAudiobookSelect} />
          )}

          {/* Voice Controls */}
          {showSettings && (
            <VoiceControls
              voices={availableVoices}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              rate={rate}
              onRateChange={setRate}
              pitch={pitch}
              onPitchChange={setPitch}
              volume={volume}
              onVolumeChange={setVolume}
            />
          )}

          {/* Text Display */}
          {currentAudiobook ? (
            <AudiobookPlayer
              audiobook={currentAudiobook}
              isPlaying={isPlayingAudiobook}
              onPlayStateChange={setIsPlayingAudiobook}
            />
          ) : (
            <TextDisplay
              text={text}
              onTextChange={setText}
              currentPosition={currentPosition}
              isPlaying={isPlaying}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Supports EPUB, PDF, DOCX, TXT files, free ebook downloads, and audiobook streaming. Perfect for accessibility, learning, and multitasking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechReader;