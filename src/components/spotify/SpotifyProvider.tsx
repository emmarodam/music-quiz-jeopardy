'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSpotifyStore } from '@/stores/spotifyStore';

// Add Spotify SDK types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

interface SpotifyPlayer {
  addListener: (event: string, callback: (data: unknown) => void) => void;
  removeListener: (event: string) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

interface SpotifyProviderProps {
  children: React.ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const {
    accessToken,
    isPremium,
    isAuthenticated,
    setDeviceId,
    setPlayerReady,
    setIsPlaying,
  } = useSpotifyStore();

  const initializePlayer = useCallback(() => {
    if (!accessToken || !isPremium || !window.Spotify) return;

    const player = new window.Spotify.Player({
      name: 'Music Quiz Game',
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    // Error handling
    player.addListener('initialization_error', (data: unknown) => {
      const { message } = data as { message: string };
      console.error('Spotify initialization error:', message);
    });

    player.addListener('authentication_error', (data: unknown) => {
      const { message } = data as { message: string };
      console.error('Spotify authentication error:', message);
    });

    player.addListener('account_error', (data: unknown) => {
      const { message } = data as { message: string };
      console.error('Spotify account error:', message);
    });

    player.addListener('playback_error', (data: unknown) => {
      const { message } = data as { message: string };
      console.error('Spotify playback error:', message);
    });

    // Ready
    player.addListener('ready', (data: unknown) => {
      const { device_id } = data as { device_id: string };
      console.log('Spotify player ready with device ID:', device_id);
      setDeviceId(device_id);
      setPlayerReady(true);
    });

    // Not Ready
    player.addListener('not_ready', (data: unknown) => {
      const { device_id } = data as { device_id: string };
      console.log('Spotify device has gone offline:', device_id);
      setPlayerReady(false);
    });

    // State changes
    player.addListener('player_state_changed', (data: unknown) => {
      const state = data as { paused: boolean } | null;
      if (state) {
        setIsPlaying(!state.paused);
      }
    });

    // Connect
    player.connect().then((success) => {
      if (success) {
        console.log('Spotify player connected successfully');
      } else {
        console.error('Failed to connect Spotify player');
      }
    });

    playerRef.current = player;
  }, [accessToken, isPremium, setDeviceId, setPlayerReady, setIsPlaying]);

  // Load Spotify SDK script
  useEffect(() => {
    if (!isAuthenticated || !isPremium) return;

    // Check if SDK is already loaded
    if (window.Spotify) {
      initializePlayer();
      return;
    }

    // Load SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      // Note: We don't remove the script as it might cause issues with HMR
    };
  }, [isAuthenticated, isPremium, initializePlayer]);

  return <>{children}</>;
}
