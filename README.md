# Music Quiz Jeopardy

A fun, Jeopardy-style music quiz game with YouTube integration. Players hear music clips and try to guess the song - perfect for game nights!

## Features

- **Jeopardy-style gameplay** - 6 categories, 5 point values each (100-500)
- **YouTube audio playback** - Players hear the music but can't see the video title
- **2-4 players** - Take turns answering questions
- **Score tracking** - Correct answers add points, wrong answers subtract
- **Confetti celebrations** - Visual feedback for correct answers
- **Team customization** - Pick emojis and customize team names
- **Ready-made quizzes** - Disney, Taylor Swift, and Ultimate Music Quiz included
- **Create your own** - Build custom quizzes with any YouTube videos

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd music-quiz-jeopardy
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

That's it! No environment variables or API keys needed.

## How to Play

1. **Choose a quiz** - Pick from ready-made quizzes or create your own
2. **Set up teams** - Add 2-4 teams, customize names and emojis
3. **Play!** - Click a point value to reveal a question
4. **Listen** - Press play to hear the music clip
5. **Reveal answer** - Click to show the answer
6. **Score** - Mark correct or wrong to update scores
7. **Winner** - Team with the most points wins!

## Creating Custom Quizzes

1. Click "Create Your Own" on the home page
2. Name your quiz
3. Add 6 categories with names
4. For each category, add 5 questions (100-500 points)
5. For audio questions, paste a YouTube URL
6. Start playing!

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **YouTube IFrame API** - Audio playback

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── page.tsx         # Home page
│   ├── game/            # Game board
│   └── create/          # Quiz creator
├── components/          # React components
│   ├── game/            # Game components
│   └── create/          # Creator components
├── data/                # Ready-made quizzes
├── stores/              # Zustand state
└── types/               # TypeScript types
```

## License

MIT
