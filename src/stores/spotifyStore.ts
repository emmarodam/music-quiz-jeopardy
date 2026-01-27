'use client';

import { create } from 'zustand';
import { SpotifyTrack, SpotifyUser } from '@/types/spotify';

interface SpotifyState {
  // Auth state
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;

  // User info
  user: SpotifyUser | null;
  isPremium: boolean;

  // Player state
  deviceId: string | null;
  isPlayerReady: boolean;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void;
  clearAuth: () => void;
  setUser: (user: SpotifyUser) => void;
  setDeviceId: (deviceId: string) => void;
  setPlayerReady: (ready: boolean) => void;
  setCurrentTrack: (track: SpotifyTrack | null) => void;
  setIsPlaying: (playing: boolean) => void;

  // Helpers
  isTokenExpired: () => boolean;
}

export const useSpotifyStore = create<SpotifyState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  user: null,
  isPremium: false,
  deviceId: null,
  isPlayerReady: false,
  currentTrack: null,
  isPlaying: false,

  setTokens: (accessToken, refreshToken, expiresIn) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    set({
      accessToken,
      refreshToken,
      expiresAt,
      isAuthenticated: true,
    });
  },

  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      user: null,
      isPremium: false,
      deviceId: null,
      isPlayerReady: false,
      currentTrack: null,
      isPlaying: false,
    }),

  setUser: (user) =>
    set({
      user,
      isPremium: user.product === 'premium',
    }),

  setDeviceId: (deviceId) => set({ deviceId }),

  setPlayerReady: (ready) => set({ isPlayerReady: ready }),

  setCurrentTrack: (track) => set({ currentTrack: track }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  isTokenExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt - 60000; // 1 minute buffer
  },
}));
