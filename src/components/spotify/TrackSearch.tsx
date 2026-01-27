'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Pause, Check, Loader2 } from 'lucide-react';
import { useSpotifyStore } from '@/stores/spotifyStore';
import { SpotifyTrack } from '@/types/spotify';

interface TrackSearchProps {
  onSelectTrack: (track: SpotifyTrack) => void;
  selectedTrackId?: string;
}

export function TrackSearch({ onSelectTrack, selectedTrackId }: TrackSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const { accessToken } = useSpotifyStore();

  const searchTracks = useCallback(async () => {
    if (!query.trim() || !accessToken) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, accessToken]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchTracks();
    }
  };

  const playPreview = (track: SpotifyTrack) => {
    // Stop any currently playing preview
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if (!track.preview_url) return;

    if (playingPreviewId === track.id) {
      setPlayingPreviewId(null);
      return;
    }

    const audio = new Audio(track.preview_url);
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => setPlayingPreviewId(null);

    setAudioElement(audio);
    setPlayingPreviewId(track.id);
  };

  const handleSelectTrack = (track: SpotifyTrack) => {
    // Stop preview if playing
    if (audioElement) {
      audioElement.pause();
    }
    setPlayingPreviewId(null);
    onSelectTrack(track);
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a song..."
            className="w-full pl-10 pr-4 py-3 bg-board-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <motion.button
          onClick={searchTracks}
          disabled={!query.trim() || isSearching}
          className="px-6 py-3 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-board-bg font-bold rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </motion.button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2 max-h-80 overflow-y-auto"
          >
            {results.map((track) => {
              const isSelected = track.id === selectedTrackId;
              const isPlaying = track.id === playingPreviewId;
              const albumImage = track.album.images[2]?.url || track.album.images[0]?.url;

              return (
                <motion.div
                  key={track.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-gold/20 border border-gold'
                      : 'bg-board-bg hover:bg-cell-bg border border-transparent'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSelectTrack(track)}
                >
                  {/* Album art */}
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    {albumImage && (
                      <img src={albumImage} alt={track.album.name} className="w-full h-full object-cover" />
                    )}
                    {track.preview_url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPreview(track);
                        }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" fill="white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" fill="white" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.name}</p>
                    <p className="text-gray-400 text-sm truncate">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                      <Check className="w-5 h-5 text-board-bg" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      {query && results.length === 0 && !isSearching && (
        <p className="text-center text-gray-400 py-4">No tracks found. Try a different search.</p>
      )}
    </div>
  );
}
