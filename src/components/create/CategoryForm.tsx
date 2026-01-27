'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '@/types/game';
import { QuestionForm } from './QuestionForm';

interface CategoryFormProps {
  category: Category;
  categoryIndex: number;
  onChange: (category: Category) => void;
}

export function CategoryForm({ category, categoryIndex, onChange }: CategoryFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuestionChange = (questionIndex: number, updatedQuestion: typeof category.questions[0]) => {
    const updatedQuestions = [...category.questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    onChange({ ...category, questions: updatedQuestions });
  };

  const completedQuestions = category.questions.filter(
    (q) => q.answer && (q.questionText || q.youtubeVideoId)
  ).length;

  return (
    <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl overflow-hidden">
      {/* Category header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-purple-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center shadow-lg">
            {categoryIndex + 1}
          </span>
          <div className="text-left">
            <input
              type="text"
              value={category.name}
              onChange={(e) => onChange({ ...category, name: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder={`Category ${categoryIndex + 1} name`}
              className="bg-transparent text-white font-bold text-lg placeholder-purple-400/50 focus:outline-none border-b border-transparent focus:border-pink-500 transition-colors"
            />
            <p className="text-sm text-purple-300">
              {completedQuestions}/5 questions completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress indicator */}
          <div className="flex gap-1">
            {category.questions.map((q, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  q.answer && (q.questionText || q.youtubeVideoId)
                    ? 'bg-green-400'
                    : 'bg-purple-700'
                }`}
              />
            ))}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-purple-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-purple-300" />
          )}
        </div>
      </button>

      {/* Questions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {category.questions.map((question, qIndex) => (
                <QuestionForm
                  key={question.id}
                  question={question}
                  onChange={(updated) => handleQuestionChange(qIndex, updated)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
