'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home, Play, Plus, Minus, Users } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { Scoreboard } from '@/components/game/Scoreboard';
import { QuestionModal } from '@/components/game/QuestionModal';
import { ConfettiCelebration } from '@/components/game/ConfettiCelebration';
import { TEAM_EMOJIS } from '@/types/game';

export default function GamePage() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<string | null>(null);
  const {
    currentGame,
    currentQuestion,
    isQuestionModalOpen,
    closeQuestion,
    resetGame,
    answeredQuestions,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerEmoji,
  } = useGameStore();

  // Redirect if no game
  useEffect(() => {
    if (!currentGame) {
      router.push('/');
    }
  }, [currentGame, router]);

  // Check if game has already been played (has answered questions)
  useEffect(() => {
    if (currentGame && answeredQuestions.size > 0) {
      setGameStarted(true);
    }
  }, [currentGame, answeredQuestions]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setEmojiPickerOpen(null);
    if (emojiPickerOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [emojiPickerOpen]);

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalQuestions = currentGame.categories.length * 5;
  const isGameComplete = answeredQuestions.size === totalQuestions;

  // Find winner
  const sortedPlayers = [...currentGame.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const handleAddPlayer = () => {
    if (currentGame.players.length >= 4) return;
    addPlayer(`Team ${currentGame.players.length + 1}`);
  };

  const handleRemovePlayer = (id: string) => {
    if (currentGame.players.length <= 2) return;
    removePlayer(id);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleEmojiSelect = (playerId: string, emoji: string) => {
    updatePlayerEmoji(playerId, emoji);
    setEmojiPickerOpen(null);
  };

  // Team Setup Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="border-b border-purple-500/20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {currentGame.name}
            </h1>
            <div className="w-16" />
          </div>
        </header>

        {/* Team Setup */}
        <div className="flex-1 flex items-center justify-center p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Set Up Teams</h2>
              <p className="text-purple-300">Add 2-4 teams and customize their names</p>
            </div>

            {/* Player List */}
            <div className="space-y-3">
              {currentGame.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-purple-900/30 border border-purple-500/20 rounded-xl"
                >
                  {/* Emoji Selector */}
                  <div className="relative">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmojiPickerOpen(emojiPickerOpen === player.id ? null : player.id);
                      }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-700/60 to-purple-800/60 hover:from-purple-600/60 hover:to-purple-700/60 flex items-center justify-center text-2xl transition-all border border-purple-500/30 hover:border-pink-500/50 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {player.emoji || '🎵'}
                    </motion.button>

                    {/* Emoji Picker Dropdown */}
                    <AnimatePresence>
                      {emojiPickerOpen === player.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                          className="absolute top-14 left-0 z-50 bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/40 rounded-2xl p-4 shadow-2xl min-w-[280px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Arrow pointer */}
                          <div className="absolute -top-2 left-4 w-4 h-4 bg-purple-900 border-l border-t border-purple-500/40 rotate-45" />

                          <p className="text-purple-200 text-sm font-medium mb-3 text-center">Choose your team icon</p>

                          {/* Music category */}
                          <div className="mb-3">
                            <p className="text-purple-400 text-xs mb-1.5 uppercase tracking-wide">Music</p>
                            <div className="grid grid-cols-8 gap-1">
                              {TEAM_EMOJIS.slice(0, 8).map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(player.id, emoji)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all ${
                                    player.emoji === emoji
                                      ? 'bg-pink-500/40 ring-2 ring-pink-400 shadow-lg shadow-pink-500/20'
                                      : 'hover:bg-purple-700/50'
                                  }`}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Animals category */}
                          <div className="mb-3">
                            <p className="text-purple-400 text-xs mb-1.5 uppercase tracking-wide">Animals</p>
                            <div className="grid grid-cols-8 gap-1">
                              {TEAM_EMOJIS.slice(8, 16).map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(player.id, emoji)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all ${
                                    player.emoji === emoji
                                      ? 'bg-pink-500/40 ring-2 ring-pink-400 shadow-lg shadow-pink-500/20'
                                      : 'hover:bg-purple-700/50'
                                  }`}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Symbols category */}
                          <div className="mb-3">
                            <p className="text-purple-400 text-xs mb-1.5 uppercase tracking-wide">Symbols</p>
                            <div className="grid grid-cols-8 gap-1">
                              {TEAM_EMOJIS.slice(16, 24).map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(player.id, emoji)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all ${
                                    player.emoji === emoji
                                      ? 'bg-pink-500/40 ring-2 ring-pink-400 shadow-lg shadow-pink-500/20'
                                      : 'hover:bg-purple-700/50'
                                  }`}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Fun category */}
                          <div>
                            <p className="text-purple-400 text-xs mb-1.5 uppercase tracking-wide">Fun</p>
                            <div className="grid grid-cols-8 gap-1">
                              {TEAM_EMOJIS.slice(24, 32).map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(player.id, emoji)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all ${
                                    player.emoji === emoji
                                      ? 'bg-pink-500/40 ring-2 ring-pink-400 shadow-lg shadow-pink-500/20'
                                      : 'hover:bg-purple-700/50'
                                  }`}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="flex-1 bg-transparent text-white font-medium text-lg focus:outline-none border-b-2 border-transparent focus:border-pink-500 transition-colors"
                    placeholder={`Team ${index + 1}`}
                  />
                  {currentGame.players.length > 2 && (
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <Minus className="w-5 h-5 text-red-400" />
                    </button>
                  )}
                </motion.div>
              ))}

              {currentGame.players.length < 4 && (
                <motion.button
                  onClick={handleAddPlayer}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-300 hover:text-white hover:border-pink-500 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="w-5 h-5" />
                  Add Team
                </motion.button>
              )}
            </div>

            {/* Start Button */}
            <motion.button
              onClick={handleStartGame}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-xl rounded-xl transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-6 h-6" />
              Start Game
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col">
      {/* Confetti */}
      <ConfettiCelebration />

      {/* Header */}
      <header className="border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">{currentGame.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-lg transition-colors"
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
            className="text-center space-y-6 bg-purple-900/30 border border-purple-500/20 p-8 rounded-2xl max-w-md w-full"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Game Over!
            </h2>

            <div className="space-y-2">
              <p className="text-purple-300">Winner</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">{winner.emoji || '🏆'}</span>
                <span className="text-3xl font-bold text-white">{winner.name}</span>
              </div>
              <p className="text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold">
                ${winner.score}
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-purple-300 text-sm">Final Scores</p>
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between px-4 py-2 bg-purple-950/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">{index + 1}.</span>
                    <span className="text-lg">{player.emoji || '🎵'}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className={player.score >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {player.score >= 0 ? '' : '-'}${Math.abs(player.score)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={resetGame}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </motion.button>
              <motion.button
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-white font-bold rounded-lg transition-colors"
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
