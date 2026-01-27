'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Plus, Music, Trophy, Users, Youtube, Sparkles } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { testGame } from '@/data/testGame';

export default function HomePage() {
  const router = useRouter();
  const { currentGame, setGame } = useGameStore();

  const hasExistingGame = currentGame && currentGame.categories.some(
    (cat) => cat.name && cat.questions.some((q) => q.answer)
  );

  const loadTestGame = () => {
    setGame(testGame);
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-2xl"
        >
          {/* Logo / Title */}
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Music className="w-14 h-14 text-yellow-400 drop-shadow-lg" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Music</span>
                {' '}
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">Quiz</span>
              </h1>
            </motion.div>
            <p className="text-xl text-purple-200">Jeopardy-Style Music Trivia</p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 py-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-sm rounded-2xl border border-yellow-500/30 shadow-lg"
            >
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-sm text-white font-medium">Score Points</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-red-500/30 to-pink-500/30 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-lg"
            >
              <Youtube className="w-8 h-8 text-red-400" />
              <span className="text-sm text-white font-medium">YouTube Songs</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 backdrop-blur-sm rounded-2xl border border-cyan-500/30 shadow-lg"
            >
              <Users className="w-8 h-8 text-cyan-400" />
              <span className="text-sm text-white font-medium">2-4 Players</span>
            </motion.div>
          </div>

          {/* Action Buttons - Always visible now */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.button
              onClick={() => router.push('/create')}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-6 h-6" />
              Create New Game
            </motion.button>

            <motion.button
              onClick={loadTestGame}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-6 h-6" />
              Try Demo Game
            </motion.button>

            {hasExistingGame && (
              <motion.button
                onClick={() => router.push('/game')}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-6 h-6" />
                Continue Game
              </motion.button>
            )}
          </div>

          {/* Info text */}
          <p className="text-purple-300/70 text-sm pt-4">
            Add YouTube links to your questions - players hear the music but can&apos;t see the video!
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-purple-300/60 text-sm relative z-10">
        <p>Create custom music quizzes with your favorite songs</p>
      </footer>
    </div>
  );
}
