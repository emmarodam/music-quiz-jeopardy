'use client';

import { Game } from '@/types/game';
import { CategoryHeader } from './CategoryHeader';
import { QuestionCell } from './QuestionCell';
import { useGameStore } from '@/stores/gameStore';

interface GameBoardProps {
  game: Game;
}

export function GameBoard({ game }: GameBoardProps) {
  const selectQuestion = useGameStore((state) => state.selectQuestion);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Category Headers */}
      <div className="grid grid-cols-6 gap-2 md:gap-3 mb-2 md:mb-3">
        {game.categories.map((category) => (
          <CategoryHeader key={category.id} name={category.name} />
        ))}
      </div>

      {/* Question Grid - 5 rows x 6 columns */}
      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {[0, 1, 2, 3, 4].map((rowIndex) =>
          game.categories.map((category, categoryIndex) => {
            const question = category.questions[rowIndex];
            return (
              <QuestionCell
                key={`${categoryIndex}-${rowIndex}`}
                question={question}
                onClick={() => selectQuestion(categoryIndex, rowIndex)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
