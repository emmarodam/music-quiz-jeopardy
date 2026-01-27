import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getCurrentUser } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(`${appUrl}?error=spotify_auth_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user info to check if they're premium
    const user = await getCurrentUser(tokens.access_token);

    // Create URL with tokens as hash params (client-side only)
    // In production, you'd want to use secure cookies or a session
    const redirectUrl = new URL(`${appUrl}/auth/spotify/success`);
    redirectUrl.hash = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in.toString(),
      user_id: user.id,
      user_name: user.display_name || '',
      is_premium: (user.product === 'premium').toString(),
    }).toString();

    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    return NextResponse.redirect(`${appUrl}?error=token_exchange_failed`);
  }
}
