import { create } from 'zustand'

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface GameState {
  currentLevel: Level
  completedLevels: number[]
  showingReveal: boolean
  goToLevel: (level: Level) => void
  completeLevel: (level: Level) => void
  setShowingReveal: (showing: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  currentLevel: 0,
  completedLevels: [],
  showingReveal: false,
  goToLevel: (level) => set({ currentLevel: level, showingReveal: false }),
  completeLevel: (level) =>
    set((state) => ({
      completedLevels: [...new Set([...state.completedLevels, level])],
      showingReveal: true,
    })),
  setShowingReveal: (showing) => set({ showingReveal: showing }),
}))

export const LEVEL_TITLES: Record<number, string> = {
  1: "The Ghost Button",
  2: "Heart Pop",
  3: "The Love Slider",
  4: "Scratch & Reveal",
  5: "Secret Password",
  6: "Pattern Match",
  7: "Emoji Rain",
  8: "The Keyhole",
  9: "Photo Puzzle",
  10: "The Finale",
}

export const REVEAL_IMAGES: Record<number, string> = {
  1: "/images/reveal-1.JPG",
  2: "/images/reveal-2.jpg",
  3: "/images/reveal-3.JPG",
  4: "/images/reveal-4.jpg",
  5: "/images/reveal-5.jpg",
  6: "/images/reveal-6.JPG",
  7: "/images/reveal-7.JPG",
  8: "/images/reveal-8.jpg",
}
