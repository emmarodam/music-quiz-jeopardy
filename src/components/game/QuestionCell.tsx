'use client';

import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { Question } from '@/types/game';

interface QuestionCellProps {
  question: Question;
  onClick: () => void;
}

export function QuestionCell({ question, onClick }: QuestionCellProps) {
  const isAnswered = question.isAnswered;
  const hasAudio = question.type === 'audio' || question.type === 'both';

  if (isAnswered) {
    return (
      <div className="aspect-[3/2] bg-cell-answered rounded-lg flex items-center justify-center opacity-30">
        <span className="text-2xl font-bold text-gray-500">${question.points}</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className="aspect-[3/2] bg-cell-bg hover:bg-cell-hover rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors shadow-lg hover:shadow-xl relative group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-3xl md:text-4xl font-bold text-gold">${question.points}</span>
      {hasAudio && (
        <Music className="absolute bottom-2 right-2 w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" />
      )}
    </motion.button>
  );
}
