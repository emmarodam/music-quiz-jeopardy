'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Music } from 'lucide-react';
import { Question } from '@/types/game';

interface AudioPlayerProps {
  question: Question;
}

export function AudioPlayer({ question }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!question.youtubeVideoId) return;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Wait for API to be ready
    const initPlayer = () => {
      if (containerRef.current && window.YT && window.YT.Player && question.youtubeVideoId) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: question.youtubeVideoId,
          playerVars: {
            autoplay: 0,
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
  }, [question.youtubeVideoId]);

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

  const handlePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setHasPlayed(true);
    }
  };

  const handleReplay = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0, true);
    playerRef.current.playVideo();
    setProgress(0);
    setHasPlayed(true);
  };

  if (!question.youtubeVideoId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl border border-purple-500/30">
      {/* Hidden YouTube player */}
      <div className="w-0 h-0 overflow-hidden absolute">
        <div ref={containerRef} />
      </div>

      {/* Audio visualizer */}
      <div className="relative">
        <motion.div
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
        >
          <Music className="w-12 h-12 text-white" />
        </motion.div>

        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-400"
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Sound waves animation */}
      {isPlaying && (
        <div className="flex items-end gap-1 h-8">
          {[...Array(7)].map((_, i) => (
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

      {!isPlaying && !hasPlayed && isReady && (
        <p className="text-purple-300 text-sm">Press play to hear the music</p>
      )}

      {!isReady && (
        <p className="text-purple-400 text-sm animate-pulse">Loading...</p>
      )}

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2 bg-purple-900/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Play controls */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={handlePlay}
          disabled={!isReady}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isReady
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          whileHover={isReady ? { scale: 1.05 } : {}}
          whileTap={isReady ? { scale: 0.95 } : {}}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          )}
        </motion.button>

        {hasPlayed && !isPlaying && (
          <motion.button
            onClick={handleReplay}
            className="w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center shadow-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </div>

      <p className="text-purple-300 text-sm">
        {isPlaying ? 'Playing...' : hasPlayed ? 'Play again?' : ''}
      </p>
    </div>
  );
}
