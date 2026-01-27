import { NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET() {
  try {
    const authUrl = getSpotifyAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Spotify authentication' },
      { status: 500 }
    );
  }
}
