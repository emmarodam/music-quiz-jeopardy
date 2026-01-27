'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, X, Link, CheckCircle } from 'lucide-react';
import { Question, QuestionType } from '@/types/game';
import { extractYouTubeVideoId } from '@/components/youtube/YouTubePlayer';

interface QuestionFormProps {
  question: Question;
  onChange: (question: Question) => void;
}

export function QuestionForm({ question, onChange }: QuestionFormProps) {
  const [youtubeInput, setYoutubeInput] = useState(question.youtubeUrl || '');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleYouTubeUrlChange = (url: string) => {
    setYoutubeInput(url);
    setInputError(null);

    if (!url.trim()) {
      // Clear YouTube data if URL is empty
      onChange({
        ...question,
        type: question.questionText ? 'text' : 'text',
        youtubeVideoId: undefined,
        youtubeUrl: undefined,
      });
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      onChange({
        ...question,
        type: question.questionText ? 'both' : 'audio',
        youtubeVideoId: videoId,
        youtubeUrl: url,
      });
    } else {
      setInputError('Invalid YouTube URL. Try a link like youtube.com/watch?v=... or youtu.be/...');
    }
  };

  const clearYouTube = () => {
    setYoutubeInput('');
    setInputError(null);
    onChange({
      ...question,
      type: 'text',
      youtubeVideoId: undefined,
      youtubeUrl: undefined,
    });
  };

  const handleQuestionTypeChange = (type: QuestionType) => {
    onChange({ ...question, type });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 space-y-4 border border-purple-500/20">
      {/* Points display */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          ${question.points}
        </span>
        <div className="flex gap-2">
          {(['text', 'audio', 'both'] as QuestionType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleQuestionTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                question.type === type
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-purple-900/50 text-purple-300 hover:text-white hover:bg-purple-800/50'
              }`}
            >
              {type === 'text' ? 'Text' : type === 'audio' ? 'Audio' : 'Both'}
            </button>
          ))}
        </div>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-sm text-purple-300 mb-1">Question</label>
        <textarea
          value={question.questionText}
          onChange={(e) => onChange({ ...question, questionText: e.target.value })}
          placeholder="Enter your question (optional for audio-only)"
          className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors resize-none"
          rows={2}
        />
      </div>

      {/* Answer */}
      <div>
        <label className="block text-sm text-purple-300 mb-1">Answer</label>
        <input
          type="text"
          value={question.answer}
          onChange={(e) => onChange({ ...question, answer: e.target.value })}
          placeholder="Enter the correct answer"
          className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      {/* YouTube URL input */}
      {(question.type === 'audio' || question.type === 'both') && (
        <div>
          <label className="block text-sm text-purple-300 mb-2">YouTube Song</label>

          {question.youtubeVideoId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-lg border border-red-500/30"
            >
              <div className="w-12 h-12 rounded bg-red-500/20 flex items-center justify-center">
                <Youtube className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-white font-medium">YouTube Video Added</p>
                </div>
                <p className="text-gray-400 text-sm truncate">{question.youtubeUrl}</p>
              </div>
              <button
                onClick={clearYouTube}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Link className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  placeholder="Paste YouTube URL (e.g., youtube.com/watch?v=...)"
                  className={`w-full pl-12 pr-4 py-3 bg-purple-950/50 border rounded-lg text-white placeholder-purple-400/50 focus:outline-none transition-colors ${
                    inputError
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-purple-500/30 focus:border-pink-500'
                  }`}
                />
              </div>
              {inputError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {inputError}
                </motion.p>
              )}
              <p className="text-purple-400/70 text-xs">
                Supports youtube.com, youtu.be, and YouTube Shorts links
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
