'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Player } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

interface ScoreboardProps {
  players: Player[];
}

export function Scoreboard({ players }: ScoreboardProps) {
  const { currentPlayerIndex, lastAnswerCorrect } = useGameStore();

  // Sort players by score for leader display
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leaderId = sortedPlayers[0]?.score > 0 ? sortedPlayers[0].id : null;

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 p-4">
      {players.map((player, index) => {
        const isCurrentPlayer = index === currentPlayerIndex;
        const isLeader = player.id === leaderId;
        const justScored = isCurrentPlayer && lastAnswerCorrect !== null;
        const scoredPositive = justScored && lastAnswerCorrect === true;
        const scoredNegative = justScored && lastAnswerCorrect === false;

        return (
          <motion.div
            key={player.id}
            className={`relative flex flex-col items-center p-4 rounded-xl min-w-[120px] transition-all ${
              isCurrentPlayer
                ? 'bg-white/10 ring-2 ring-gold animate-pulse-glow'
                : 'bg-white/5'
            }`}
            layout
          >
            {/* Leader crown */}
            <AnimatePresence>
              {isLeader && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  <Crown className="w-6 h-6 text-gold fill-gold" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Player color indicator */}
            <div
              className="w-4 h-4 rounded-full mb-2"
              style={{ backgroundColor: player.color }}
            />

            {/* Player name */}
            <p className="text-white font-medium text-sm md:text-base mb-1 truncate max-w-[100px]">
              {player.name}
            </p>

            {/* Score */}
            <motion.p
              className={`text-2xl md:text-3xl font-bold ${
                player.score >= 0 ? 'text-gold' : 'text-wrong'
              } ${scoredPositive ? 'animate-score-pop text-correct' : ''} ${
                scoredNegative ? 'animate-shake text-wrong' : ''
              }`}
              key={player.score} // Trigger animation on score change
              initial={{ scale: 1 }}
              animate={{
                scale: justScored ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {player.score >= 0 ? '' : '-'}${Math.abs(player.score)}
            </motion.p>

            {/* Current player indicator */}
            {isCurrentPlayer && (
              <motion.p
                className="text-xs text-gold mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Current Turn
              </motion.p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
