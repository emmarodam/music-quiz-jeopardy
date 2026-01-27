'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface AnswerButtonsProps {
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
}

export function AnswerButtons({ onCorrect, onWrong, disabled = false }: AnswerButtonsProps) {
  return (
    <div className="flex gap-6 justify-center">
      <motion.button
        onClick={onWrong}
        disabled={disabled}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-wrong hover:bg-wrong-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-colors"
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <X className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
      </motion.button>

      <motion.button
        onClick={onCorrect}
        disabled={disabled}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-correct hover:bg-correct-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-colors"
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
      </motion.button>
    </div>
  );
}
