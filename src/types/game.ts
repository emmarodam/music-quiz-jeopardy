export type PointValue = 100 | 200 | 300 | 400 | 500;

export type QuestionType = 'text' | 'audio' | 'both';

export interface Question {
  id: string;
  categoryIndex: number;
  questionIndex: number;
  points: PointValue;
  type: QuestionType;
  questionText: string;
  answer: string;
  // YouTube fields
  youtubeVideoId?: string;
  youtubeUrl?: string;
  // Legacy Spotify fields (kept for compatibility)
  spotifyTrackId?: string;
  spotifyTrackUri?: string;
  spotifyTrackName?: string;
  spotifyArtistName?: string;
  spotifyPreviewUrl?: string;
  spotifyAlbumImage?: string;
  audioStartMs?: number;
  audioDurationMs?: number;
  isAnswered: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface Game {
  id: string;
  name: string;
  description?: string;
  categories: Category[];
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
}

export const POINT_VALUES: PointValue[] = [100, 200, 300, 400, 500];

export const PLAYER_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
];

export const DEFAULT_AUDIO_DURATION_MS = 30000;

export function createEmptyQuestion(
  categoryIndex: number,
  questionIndex: number
): Question {
  return {
    id: `q-${categoryIndex}-${questionIndex}`,
    categoryIndex,
    questionIndex,
    points: POINT_VALUES[questionIndex],
    type: 'text',
    questionText: '',
    answer: '',
    isAnswered: false,
  };
}

export function createEmptyCategory(index: number): Category {
  return {
    id: `cat-${index}`,
    name: '',
    questions: POINT_VALUES.map((_, qIndex) =>
      createEmptyQuestion(index, qIndex)
    ),
  };
}

export function createEmptyGame(): Game {
  return {
    id: crypto.randomUUID(),
    name: '',
    categories: Array.from({ length: 6 }, (_, i) => createEmptyCategory(i)),
    players: [
      { id: '1', name: 'Team 1', score: 0, color: PLAYER_COLORS[0] },
      { id: '2', name: 'Team 2', score: 0, color: PLAYER_COLORS[1] },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
