'use client';

import { create } from 'zustand';
import { Game, Question, Player, createEmptyGame, PLAYER_COLORS, TEAM_EMOJIS } from '@/types/game';

interface GameState {
  // Game data
  currentGame: Game | null;
  answeredQuestions: Set<string>;
  currentQuestion: Question | null;
  isQuestionModalOpen: boolean;

  // Player management
  currentPlayerIndex: number;

  // UI feedback state
  lastAnswerCorrect: boolean | null;
  showConfetti: boolean;

  // Actions
  setGame: (game: Game) => void;
  selectQuestion: (categoryIndex: number, questionIndex: number) => void;
  markCorrect: () => void;
  markWrong: () => void;
  closeQuestion: () => void;
  resetGame: () => void;
  clearConfetti: () => void;

  // Player actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  updatePlayerEmoji: (id: string, emoji: string) => void;
  setCurrentPlayer: (index: number) => void;
  nextPlayer: () => void;

  // Game setup
  setPlayers: (players: Player[]) => void;
  initializeNewGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentGame: null,
  answeredQuestions: new Set(),
  currentQuestion: null,
  isQuestionModalOpen: false,
  currentPlayerIndex: 0,
  lastAnswerCorrect: null,
  showConfetti: false,

  setGame: (game) =>
    set({
      currentGame: game,
      answeredQuestions: new Set(),
      currentPlayerIndex: 0,
      lastAnswerCorrect: null,
    }),

  selectQuestion: (categoryIndex, questionIndex) => {
    const game = get().currentGame;
    if (!game) return;

    const question = game.categories[categoryIndex]?.questions[questionIndex];
    if (!question || question.isAnswered) return;

    set({
      currentQuestion: question,
      isQuestionModalOpen: true,
      lastAnswerCorrect: null,
    });
  },

  markCorrect: () => {
    const { currentQuestion, currentGame, currentPlayerIndex, answeredQuestions } = get();
    if (!currentQuestion || !currentGame) return;

    const updatedPlayers = [...currentGame.players];
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      score: updatedPlayers[currentPlayerIndex].score + currentQuestion.points,
    };

    const updatedCategories = currentGame.categories.map((cat, catIdx) => {
      if (catIdx !== currentQuestion.categoryIndex) return cat;
      return {
        ...cat,
        questions: cat.questions.map((q, qIdx) => {
          if (qIdx !== currentQuestion.questionIndex) return q;
          return { ...q, isAnswered: true };
        }),
      };
    });

    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(`${currentQuestion.categoryIndex}-${currentQuestion.questionIndex}`);

    set({
      currentGame: { ...currentGame, players: updatedPlayers, categories: updatedCategories },
      answeredQuestions: newAnswered,
      lastAnswerCorrect: true,
      showConfetti: true,
    });
  },

  markWrong: () => {
    const { currentQuestion, currentGame, currentPlayerIndex, answeredQuestions } = get();
    if (!currentQuestion || !currentGame) return;

    const updatedPlayers = [...currentGame.players];
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      score: updatedPlayers[currentPlayerIndex].score - currentQuestion.points,
    };

    const updatedCategories = currentGame.categories.map((cat, catIdx) => {
      if (catIdx !== currentQuestion.categoryIndex) return cat;
      return {
        ...cat,
        questions: cat.questions.map((q, qIdx) => {
          if (qIdx !== currentQuestion.questionIndex) return q;
          return { ...q, isAnswered: true };
        }),
      };
    });

    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(`${currentQuestion.categoryIndex}-${currentQuestion.questionIndex}`);

    set({
      currentGame: { ...currentGame, players: updatedPlayers, categories: updatedCategories },
      answeredQuestions: newAnswered,
      lastAnswerCorrect: false,
      showConfetti: false,
    });
  },

  closeQuestion: () => {
    const { currentGame, currentPlayerIndex } = get();
    if (!currentGame) return;

    // Move to next player after closing
    const nextIndex = (currentPlayerIndex + 1) % currentGame.players.length;

    set({
      currentQuestion: null,
      isQuestionModalOpen: false,
      lastAnswerCorrect: null,
      currentPlayerIndex: nextIndex,
    });
  },

  resetGame: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const resetCategories = currentGame.categories.map((cat) => ({
      ...cat,
      questions: cat.questions.map((q) => ({ ...q, isAnswered: false })),
    }));

    const resetPlayers = currentGame.players.map((p) => ({ ...p, score: 0 }));

    set({
      currentGame: { ...currentGame, categories: resetCategories, players: resetPlayers },
      answeredQuestions: new Set(),
      currentQuestion: null,
      isQuestionModalOpen: false,
      currentPlayerIndex: 0,
      lastAnswerCorrect: null,
      showConfetti: false,
    });
  },

  clearConfetti: () => set({ showConfetti: false }),

  addPlayer: (name) => {
    const { currentGame } = get();
    if (!currentGame || currentGame.players.length >= 4) return;

    const playerIndex = currentGame.players.length;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      score: 0,
      color: PLAYER_COLORS[playerIndex],
      emoji: TEAM_EMOJIS[playerIndex + 2], // Start from index 2 since 0,1 are used by default players
    };

    set({
      currentGame: {
        ...currentGame,
        players: [...currentGame.players, newPlayer],
      },
    });
  },

  removePlayer: (id) => {
    const { currentGame } = get();
    if (!currentGame || currentGame.players.length <= 2) return;

    const updatedPlayers = currentGame.players.filter((p) => p.id !== id);

    set({
      currentGame: { ...currentGame, players: updatedPlayers },
      currentPlayerIndex: 0,
    });
  },

  updatePlayerName: (id, name) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedPlayers = currentGame.players.map((p) =>
      p.id === id ? { ...p, name } : p
    );

    set({ currentGame: { ...currentGame, players: updatedPlayers } });
  },

  updatePlayerEmoji: (id, emoji) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedPlayers = currentGame.players.map((p) =>
      p.id === id ? { ...p, emoji } : p
    );

    set({ currentGame: { ...currentGame, players: updatedPlayers } });
  },

  setCurrentPlayer: (index) => set({ currentPlayerIndex: index }),

  nextPlayer: () => {
    const { currentGame, currentPlayerIndex } = get();
    if (!currentGame) return;

    const nextIndex = (currentPlayerIndex + 1) % currentGame.players.length;
    set({ currentPlayerIndex: nextIndex });
  },

  setPlayers: (players) => {
    const { currentGame } = get();
    if (!currentGame) return;
    set({ currentGame: { ...currentGame, players } });
  },

  initializeNewGame: () => {
    set({
      currentGame: createEmptyGame(),
      answeredQuestions: new Set(),
      currentQuestion: null,
      isQuestionModalOpen: false,
      currentPlayerIndex: 0,
      lastAnswerCorrect: null,
      showConfetti: false,
    });
  },
}));
