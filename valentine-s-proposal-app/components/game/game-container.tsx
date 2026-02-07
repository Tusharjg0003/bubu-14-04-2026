"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useGameStore, LEVEL_TITLES } from "@/lib/game-store"
import { LevelReveal } from "./level-reveal"
import { Level1GhostButton } from "./level-1-ghost-button"
import { Level2HeartPop } from "./level-2-heart-pop"
import { Level3LoveSlider } from "./level-3-love-slider"
import { Level4ScratchOff } from "./level-4-scratch-off"
import { Level5Password } from "./level-5-password"
import { Level6PatternMatch } from "./level-6-pattern-match"
import { Level7EmojiRain } from "./level-7-emoji-rain"
import { Level8Keyhole } from "./level-8-keyhole"
import { Level9Puzzle } from "./level-9-puzzle"
import { Finale } from "./finale"
import { WelcomeScreen } from "./welcome-screen"

function LevelHeader({ level }: { level: number }) {
  if (level === 0 || level === 10) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 z-20 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm shadow-sm border border-border">
        <span className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider">
          Level {level}
        </span>
        <span className="text-xs text-border">|</span>
        <span className="text-sm font-serif text-foreground">
          {LEVEL_TITLES[level]}
        </span>
      </div>
    </motion.div>
  )
}

function ProgressDots({ current }: { current: number }) {
  if (current === 0 || current === 10) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5"
    >
      {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
        <div
          key={level}
          className={`w-2 h-2 rounded-full transition-colors ${
            level < current
              ? "bg-primary"
              : level === current
                ? "bg-primary shadow-sm shadow-primary/50"
                : "bg-muted"
          }`}
        />
      ))}
    </motion.div>
  )
}

export function GameContainer() {
  const { currentLevel, showingReveal } = useGameStore()

  const renderLevel = () => {
    if (showingReveal && currentLevel > 0 && currentLevel < 10) {
      return <LevelReveal level={currentLevel} />
    }

    switch (currentLevel) {
      case 0:
        return <WelcomeScreen />
      case 1:
        return <Level1GhostButton />
      case 2:
        return <Level2HeartPop />
      case 3:
        return <Level3LoveSlider />
      case 4:
        return <Level4ScratchOff />
      case 5:
        return <Level5Password />
      case 6:
        return <Level6PatternMatch />
      case 7:
        return <Level7EmojiRain />
      case 8:
        return <Level8Keyhole />
      case 9:
        return <Level9Puzzle />
      case 10:
        return <Finale />
      default:
        return null
    }
  }

  return (
    <main className="relative w-screen h-dvh flex items-center justify-center bg-background overflow-hidden">
      <LevelHeader level={currentLevel} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentLevel}-${showingReveal}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full flex items-center justify-center"
        >
          {renderLevel()}
        </motion.div>
      </AnimatePresence>

      <ProgressDots current={currentLevel} />
    </main>
  )
}
