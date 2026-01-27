import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  try {
    const results = await searchTracks(accessToken, query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
