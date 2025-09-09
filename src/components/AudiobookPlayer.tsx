import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Bookmark, Clock } from 'lucide-react';

interface AudiobookPlayerProps {
  audiobook: any;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

const AudiobookPlayer: React.FC<AudiobookPlayerProps> = ({
  audiobook,
  isPlaying,
  onPlayStateChange,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => onPlayStateChange(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlayStateChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const handlePlayPause = () => {
    onPlayStateChange(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    }
  };

  const addBookmark = () => {
    if (!bookmarks.includes(currentTime)) {
      setBookmarks([...bookmarks, currentTime].sort((a, b) => a - b));
    }
  };

  const jumpToBookmark = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-6">
      <audio
        ref={audioRef}
        src={audiobook.streamUrl}
        preload="metadata"
      />
      
      {/* Audiobook Info */}
      <div className="flex items-start gap-4 mb-6">
        {audiobook.coverUrl && (
          <img
            src={audiobook.coverUrl}
            alt={audiobook.title}
            className="w-24 h-32 object-cover rounded-lg shadow-md"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{audiobook.title}</h2>
          <p className="text-gray-600 mb-1">by {audiobook.author}</p>
          <p className="text-sm text-gray-500 mb-2">Narrated by {audiobook.narrator}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {audiobook.duration}
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
              {audiobook.genre}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {audiobook.source}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div
            className="absolute top-0 left-0 h-2 bg-orange-600 rounded-lg pointer-events-none"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => handleSkip(-30)}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Skip back 30s"
        >
          <SkipBack className="h-5 w-5 text-gray-700" />
        </button>
        
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="p-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-full transition-colors"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>
        
        <button
          onClick={() => handleSkip(30)}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Skip forward 30s"
        >
          <SkipForward className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Volume Control */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Volume2 className="h-4 w-4" />
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Playback Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speed: {playbackRate}x
          </label>
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        {/* Bookmark */}
        <div>
          <button
            onClick={addBookmark}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full justify-center"
          >
            <Bookmark className="h-4 w-4" />
            Add Bookmark
          </button>
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bookmarks</h4>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((time, index) => (
              <button
                key={index}
                onClick={() => jumpToBookmark(time)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-full transition-colors"
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download Link */}
      {audiobook.downloadUrl && (
        <div className="text-center">
          <a
            href={audiobook.downloadUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Audiobook
          </a>
        </div>
      )}
    </div>
  );
};

export default AudiobookPlayer;