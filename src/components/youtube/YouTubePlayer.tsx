'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Music } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  autoPlay?: boolean;
}

export function YouTubePlayer({ videoId, autoPlay = false }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Wait for API to be ready
    const initPlayer = () => {
      if (containerRef.current && window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              if (autoPlay) {
                playerRef.current?.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTracking();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopProgressTracking();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setProgress(100);
                stopProgressTracking();
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracking();
      playerRef.current?.destroy();
    };
  }, [videoId, autoPlay]);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hidden YouTube player */}
      <div className="w-0 h-0 overflow-hidden absolute">
        <div ref={containerRef} />
      </div>

      {/* Audio-only UI */}
      <div className="w-full max-w-md">
        {/* Visualizer placeholder */}
        <div className="relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex flex-col items-center gap-4">
            {/* Music icon with animation */}
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <Music className="w-10 h-10 text-white" />
            </motion.div>

            {/* Sound waves animation */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full"
                    animate={{
                      height: ['8px', '32px', '16px', '24px', '8px'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}

            {!isPlaying && isReady && (
              <p className="text-purple-300 text-sm">Press play to hear the music</p>
            )}

            {!isReady && (
              <p className="text-purple-400 text-sm animate-pulse">Loading...</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Play/Pause button */}
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={togglePlayPause}
            disabled={!isReady}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
              isReady
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            whileHover={isReady ? { scale: 1.05 } : {}}
            whileTap={isReady ? { scale: 0.95 } : {}}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Play
              </>
            )}
          </motion.button>
        </div>

        {/* Volume indicator */}
        <div className="flex items-center justify-center gap-2 mt-3 text-purple-400 text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Audio only - video hidden</span>
        </div>
      </div>
    </div>
  );
}

// Helper to extract video ID from YouTube URL
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If it's already just a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}
