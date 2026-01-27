'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { Scoreboard } from '@/components/game/Scoreboard';
import { QuestionModal } from '@/components/game/QuestionModal';
import { ConfettiCelebration } from '@/components/game/ConfettiCelebration';

export default function GamePage() {
  const router = useRouter();
  const {
    currentGame,
    currentQuestion,
    isQuestionModalOpen,
    closeQuestion,
    resetGame,
    answeredQuestions,
  } = useGameStore();

  // Redirect if no game
  useEffect(() => {
    if (!currentGame) {
      router.push('/');
    }
  }, [currentGame, router]);

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-board-bg flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalQuestions = currentGame.categories.length * 5;
  const isGameComplete = answeredQuestions.size === totalQuestions;

  // Find winner
  const sortedPlayers = [...currentGame.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="min-h-screen bg-board-bg flex flex-col">
      {/* Confetti */}
      <ConfettiCelebration />

      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">{currentGame.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Reset Game"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Scoreboard */}
      <Scoreboard players={currentGame.players} />

      {/* Game Board */}
      {!isGameComplete && (
        <div className="flex-1 flex items-start justify-center py-4">
          <GameBoard game={currentGame} />
        </div>
      )}

      {/* Game Complete Screen */}
      {isGameComplete && (
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 bg-cell-bg p-8 rounded-2xl max-w-md w-full"
          >
            <h2 className="text-4xl font-bold text-gold">Game Over!</h2>

            <div className="space-y-2">
              <p className="text-gray-400">Winner</p>
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: winner.color }}
                />
                <span className="text-3xl font-bold text-white">{winner.name}</span>
              </div>
              <p className="text-2xl text-gold">${winner.score}</p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-gray-400 text-sm">Final Scores</p>
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between px-4 py-2 bg-board-bg rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{index + 1}.</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className={player.score >= 0 ? 'text-gold' : 'text-wrong'}>
                    {player.score >= 0 ? '' : '-'}${Math.abs(player.score)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={resetGame}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-board-bg font-bold rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </motion.button>
              <motion.button
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="w-5 h-5" />
                Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Question Modal */}
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          isOpen={isQuestionModalOpen}
          onClose={closeQuestion}
        />
      )}
    </div>
  );
}
