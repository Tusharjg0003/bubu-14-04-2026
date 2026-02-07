"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface FallingEmoji {
  id: number
  emoji: string
  x: number
  delay: number
  duration: number
  isSpecial: boolean
}

const REGULAR_EMOJIS = [
  "star", "sparkle", "cloud", "sun", "drop", "leaf", "flame", "snow",
  "bell", "gem", "crown", "bolt", "wave", "shell", "fish", "bird",
]

const SPECIAL_LABEL = "butterfly"

export function Level7EmojiRain() {
  const { completeLevel } = useGameStore()
  const [emojis, setEmojis] = useState<FallingEmoji[]>([])
  const [found, setFound] = useState(false)
  const [missed, setMissed] = useState(0)

  useEffect(() => {
    const pool: FallingEmoji[] = []
    const specialIndex = Math.floor(Math.random() * 50)

    for (let i = 0; i < 50; i++) {
      const isSpecial = i === specialIndex
      pool.push({
        id: i,
        emoji: isSpecial ? SPECIAL_LABEL : REGULAR_EMOJIS[Math.floor(Math.random() * REGULAR_EMOJIS.length)],
        x: Math.random() * 85 + 5,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 5,
        isSpecial,
      })
    }
    setEmojis(pool)
  }, [])

  const handleClick = (emoji: FallingEmoji) => {
    if (emoji.isSpecial) {
      setFound(true)
      setTimeout(() => completeLevel(7), 800)
    } else {
      setMissed((prev) => prev + 1)
      setEmojis((prev) => prev.filter((e) => e.id !== emoji.id))
    }
  }

  const getEmojiSvg = (label: string, isSpecial: boolean) => {
    if (isSpecial) {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)" stroke="hsl(346, 77%, 40%)" strokeWidth="0.5">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    }

    const colors: Record<string, string> = {
      star: "#f0a500", sparkle: "#e8768a", cloud: "#a0b0c0", sun: "#f5c542",
      drop: "#5b9bd5", leaf: "#6db56d", flame: "#e85d3a", snow: "#b0d4f1",
      bell: "#d4a344", gem: "#9b5de5", crown: "#d4a344", bolt: "#f5c542",
      wave: "#5b9bd5", shell: "#e8a098", fish: "#5b9bd5", bird: "#8b9dc3",
    }

    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={colors[label] || "#999"}>
        <circle cx="12" cy="12" r="10" opacity="0.8" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontFamily="sans-serif">
          {label.charAt(0).toUpperCase()}
        </text>
      </svg>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <p className="text-lg font-sans text-foreground/60">
          Find the special one!
        </p>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          Look for the pink checkmark among the falling icons
        </p>
        {missed > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-sans text-muted-foreground mt-1"
          >
            Not that one! Keep looking... ({missed} tried)
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {!found &&
          emojis.map((emoji) => (
            <motion.button
              key={emoji.id}
              initial={{ y: -60, opacity: 0 }}
              animate={{
                y: "100vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: emoji.delay,
                duration: emoji.duration,
                ease: "linear",
              }}
              onClick={() => handleClick(emoji)}
              className={`absolute cursor-pointer select-none ${
                emoji.isSpecial ? "z-20" : "z-10"
              }`}
              style={{ left: `${emoji.x}%` }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.6 }}
            >
              {getEmojiSvg(emoji.emoji, emoji.isSpecial)}
            </motion.button>
          ))}
      </AnimatePresence>

      {found && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center z-30"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
            <p className="text-2xl font-serif text-primary mt-4">
              You found it!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
