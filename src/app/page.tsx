'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Plus, Music, Trophy, Users, Youtube, Zap, X, Sparkles } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { readyMadeQuiz } from '@/data/testGame';
import { disneyQuiz } from '@/data/disneyQuiz';
import { taylorSwiftQuiz } from '@/data/taylorSwiftQuiz';
import { Game } from '@/types/game';

interface QuizOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  quiz: Game;
}

const quizOptions: QuizOption[] = [
  {
    id: 'ultimate',
    name: 'Ultimate Music Quiz',
    description: 'Decades of hits from 80s to today',
    emoji: '🎵',
    color: 'from-yellow-500 to-orange-500',
    quiz: readyMadeQuiz,
  },
  {
    id: 'disney',
    name: 'Disney Magic',
    description: 'Classic and modern Disney songs',
    emoji: '🏰',
    color: 'from-blue-500 to-purple-500',
    quiz: disneyQuiz,
  },
  {
    id: 'taylor',
    name: 'Taylor Swift Eras',
    description: 'Are you a true Swiftie?',
    emoji: '💜',
    color: 'from-pink-500 to-purple-500',
    quiz: taylorSwiftQuiz,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { currentGame, setGame } = useGameStore();
  const [showQuizPicker, setShowQuizPicker] = useState(false);

  const hasExistingGame = currentGame && currentGame.categories.some(
    (cat) => cat.name && cat.questions.some((q) => q.answer)
  );

  const playQuiz = (quiz: Game) => {
    setGame(quiz);
    setShowQuizPicker(false);
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
          className="text-center space-y-6 max-w-3xl"
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

          {/* Game Mode Selection */}
          <div className="pt-4">
            <p className="text-purple-200 text-lg mb-6">How do you want to play?</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Create Your Own */}
              <motion.button
                onClick={() => router.push('/create')}
                className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all group"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Create Your Own</h3>
                  <p className="text-purple-300 text-sm">Build a custom quiz with your favorite songs</p>
                </div>
              </motion.button>

              {/* Play Ready-Made Quiz */}
              <motion.button
                onClick={() => setShowQuizPicker(true)}
                className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all group"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Quick Play</h3>
                  <p className="text-purple-300 text-sm">Choose from ready-made quizzes</p>
                </div>
              </motion.button>
            </div>

            {/* Quiz Picker Modal */}
            <AnimatePresence>
              {showQuizPicker && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowQuizPicker(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-white">Choose a Quiz</h2>
                      </div>
                      <button
                        onClick={() => setShowQuizPicker(false)}
                        className="p-2 hover:bg-purple-800/50 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-purple-300" />
                      </button>
                    </div>

                    {/* Quiz Options */}
                    <div className="space-y-3">
                      {quizOptions.map((option, index) => (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => playQuiz(option.quiz)}
                          className="w-full flex items-center gap-4 p-4 bg-purple-800/30 hover:bg-purple-700/40 border border-purple-500/20 hover:border-purple-400/40 rounded-xl transition-all group text-left"
                        >
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl shadow-lg`}>
                            {option.emoji}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                              {option.name}
                            </h3>
                            <p className="text-purple-300 text-sm">{option.description}</p>
                          </div>
                          <Play className="w-5 h-5 text-purple-400 group-hover:text-yellow-400 transition-colors" />
                        </motion.button>
                      ))}
                    </div>

                    <p className="text-purple-400 text-xs text-center mt-4">
                      Each quiz has 6 categories with 30 questions!
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Game Button */}
            {hasExistingGame && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <motion.button
                  onClick={() => router.push('/game')}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-6 h-6" />
                  Continue Current Game
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Info text */}
          <p className="text-purple-300/70 text-sm pt-4">
            Players hear the music but can&apos;t see the video - perfect for guessing games!
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
