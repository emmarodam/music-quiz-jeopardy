'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Play, Plus, Minus, Music } from 'lucide-react';
import { Game, Category, Player, PLAYER_COLORS, createEmptyGame } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { CategoryForm } from './CategoryForm';

type Step = 'info' | 'categories' | 'players';

export function GameCreator() {
  const router = useRouter();
  const { setGame } = useGameStore();

  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [game, setLocalGame] = useState<Game>(createEmptyGame());

  const steps: Step[] = ['info', 'categories', 'players'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleCategoryChange = (index: number, updatedCategory: Category) => {
    const updatedCategories = [...game.categories];
    updatedCategories[index] = updatedCategory;
    setLocalGame({ ...game, categories: updatedCategories });
  };

  const handleAddPlayer = () => {
    if (game.players.length >= 4) return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: `Team ${game.players.length + 1}`,
      score: 0,
      color: PLAYER_COLORS[game.players.length],
    };
    setLocalGame({ ...game, players: [...game.players, newPlayer] });
  };

  const handleRemovePlayer = (id: string) => {
    if (game.players.length <= 2) return;
    setLocalGame({ ...game, players: game.players.filter((p) => p.id !== id) });
  };

  const handleUpdatePlayerName = (id: string, name: string) => {
    setLocalGame({
      ...game,
      players: game.players.map((p) => (p.id === id ? { ...p, name } : p)),
    });
  };

  const handleStartGame = () => {
    setGame(game);
    router.push('/game');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'info':
        return game.name.trim().length > 0;
      case 'categories':
        // At least one category with at least one complete question
        return game.categories.some((cat) =>
          cat.name && cat.questions.some((q) => q.answer && (q.questionText || q.youtubeVideoId))
        );
      case 'players':
        return game.players.length >= 2 && game.players.every((p) => p.name.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="border-b border-purple-500/20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-pink-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Create New Game
              </h1>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>

          {/* Progress steps */}
          <div className="flex items-center justify-center mt-4 gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    index <= currentStepIndex
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-purple-800/50 text-purple-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 rounded ${
                      index < currentStepIndex
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'bg-purple-800/50'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Step 1: Game Info */}
        {currentStep === 'info' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white text-center">Game Details</h2>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">Game Name</label>
                <input
                  type="text"
                  value={game.name}
                  onChange={(e) => setLocalGame({ ...game, name: e.target.value })}
                  placeholder="e.g., 80s Music Trivia"
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors text-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-300 mb-2">Description (optional)</label>
                <textarea
                  value={game.description || ''}
                  onChange={(e) => setLocalGame({ ...game, description: e.target.value })}
                  placeholder="A fun music trivia game..."
                  className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Categories */}
        {currentStep === 'categories' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Create Your Categories</h2>
              <p className="text-purple-300 mt-2">
                Add 6 categories with 5 questions each. Paste YouTube links for audio questions!
              </p>
            </div>
            <div className="space-y-4">
              {game.categories.map((category, index) => (
                <CategoryForm
                  key={category.id}
                  category={category}
                  categoryIndex={index}
                  onChange={(updated) => handleCategoryChange(index, updated)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Players */}
        {currentStep === 'players' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Set Up Players</h2>
              <p className="text-purple-300 mt-2">Add 2-4 players or teams.</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-purple-900/30 border border-purple-500/20 rounded-lg"
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleUpdatePlayerName(player.id, e.target.value)}
                    className="flex-1 bg-transparent text-white font-medium focus:outline-none border-b border-transparent focus:border-pink-500"
                  />
                  {game.players.length > 2 && (
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              ))}

              {game.players.length < 4 && (
                <motion.button
                  onClick={handleAddPlayer}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:border-pink-500 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="w-5 h-5" />
                  Add Player
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <motion.button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          {currentStep === 'players' ? (
            <motion.button
              onClick={handleStartGame}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              Start Game
            </motion.button>
          ) : (
            <motion.button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
