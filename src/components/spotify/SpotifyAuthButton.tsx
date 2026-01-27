'use client';

import { motion } from 'framer-motion';
import { Music, LogOut, CheckCircle } from 'lucide-react';
import { useSpotifyStore } from '@/stores/spotifyStore';

export function SpotifyAuthButton() {
  const { isAuthenticated, user, isPremium, clearAuth } = useSpotifyStore();

  const handleLogin = () => {
    // Redirect to Spotify OAuth
    window.location.href = '/api/spotify/auth';
  };

  const handleLogout = () => {
    clearAuth();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-correct/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-correct" />
          <div>
            <p className="text-white font-medium text-sm">{user?.display_name || 'Connected'}</p>
            <p className="text-xs text-gray-400">
              {isPremium ? 'Spotify Premium' : 'Spotify Free'}
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Disconnect Spotify"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleLogin}
      className="flex items-center gap-3 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold rounded-full transition-colors shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Music className="w-5 h-5" />
      Connect with Spotify
    </motion.button>
  );
}
