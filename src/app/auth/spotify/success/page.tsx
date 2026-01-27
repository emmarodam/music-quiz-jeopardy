'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpotifyStore } from '@/stores/spotifyStore';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SpotifySuccessPage() {
  const router = useRouter();
  const { setTokens, setUser } = useSpotifyStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Parse tokens from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const userId = params.get('user_id');
    const userName = params.get('user_name');
    const isPremium = params.get('is_premium') === 'true';

    if (!accessToken || !refreshToken || !expiresIn) {
      setStatus('error');
      setErrorMessage('Missing authentication tokens');
      return;
    }

    // Store tokens in Zustand
    setTokens(accessToken, refreshToken, parseInt(expiresIn, 10));

    // Store user info
    if (userId) {
      setUser({
        id: userId,
        display_name: userName || 'Spotify User',
        email: '',
        product: isPremium ? 'premium' : 'free',
        images: [],
      });
    }

    setStatus('success');

    // Clear the hash from URL for security
    window.history.replaceState(null, '', window.location.pathname);

    // Redirect back to home after a brief delay
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }, [setTokens, setUser, router]);

  return (
    <div className="min-h-screen bg-board-bg flex items-center justify-center p-4">
      <div className="bg-cell-bg rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-gold mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Connecting to Spotify...</h1>
            <p className="text-gray-400">Please wait while we set up your connection.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-correct mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Connected!</h1>
            <p className="text-gray-400">Redirecting you back to the game...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-wrong mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Connection Failed</h1>
            <p className="text-gray-400 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gold hover:bg-gold-light text-board-bg font-bold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
