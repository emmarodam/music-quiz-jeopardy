'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import { Question } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { AnswerButtons } from './AnswerButtons';
import { AudioPlayer } from './AudioPlayer';

interface QuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionModal({ question, isOpen, onClose }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { markCorrect, markWrong, lastAnswerCorrect, currentGame, currentPlayerIndex } =
    useGameStore();

  const currentPlayer = currentGame?.players[currentPlayerIndex];
  const hasAudio = question.type === 'audio' || question.type === 'both';

  // Reset state when modal opens with new question
  useEffect(() => {
    if (isOpen) {
      setShowAnswer(false);
      setHasAnswered(false);
    }
  }, [isOpen, question.id]);

  const handleCorrect = () => {
    markCorrect();
    setHasAnswered(true);
  };

  const handleWrong = () => {
    markWrong();
    setHasAnswered(true);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-board-bg border-2 border-gold rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Visually hidden title for accessibility */}
            <VisuallyHidden.Root>
              <Dialog.Title>Question for ${question.points} points</Dialog.Title>
              <Dialog.Description>
                {question.questionText || 'Listen to the audio and guess the answer'}
              </Dialog.Description>
            </VisuallyHidden.Root>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gold">${question.points}</span>
                {currentPlayer && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: currentPlayer.color }}
                  >
                    {currentPlayer.name}&apos;s turn
                  </span>
                )}
              </div>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Audio Player (if applicable) */}
              {hasAudio && <AudioPlayer question={question} />}

              {/* Question Text */}
              {question.questionText && (
                <div className="text-center">
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                    {question.questionText}
                  </p>
                </div>
              )}

              {/* Reveal Answer Button */}
              {!showAnswer && (
                <div className="flex justify-center">
                  <motion.button
                    onClick={() => setShowAnswer(true)}
                    className="px-8 py-3 bg-gold hover:bg-gold-light text-board-bg font-bold rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reveal Answer
                  </motion.button>
                </div>
              )}

              {/* Answer */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center p-6 bg-cell-bg/50 rounded-xl"
                  >
                    <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Answer</p>
                    <p className="text-2xl md:text-3xl text-gold font-bold">{question.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer Buttons */}
              {showAnswer && !hasAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <p className="text-center text-gray-400 mb-4">Did they get it right?</p>
                  <AnswerButtons onCorrect={handleCorrect} onWrong={handleWrong} />
                </motion.div>
              )}

              {/* Result feedback */}
              <AnimatePresence>
                {hasAnswered && lastAnswerCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    {lastAnswerCorrect ? (
                      <div className="space-y-2">
                        <p className="text-4xl font-bold text-correct">Correct!</p>
                        <p className="text-xl text-white">
                          +${question.points} for {currentPlayer?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-4xl font-bold text-wrong animate-shake">Wrong!</p>
                        <p className="text-xl text-white">
                          -${question.points} for {currentPlayer?.name}
                        </p>
                      </div>
                    )}

                    <motion.button
                      onClick={handleClose}
                      className="mt-6 px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
