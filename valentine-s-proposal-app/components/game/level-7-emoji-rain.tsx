"use client"

import { useState, useEffect, useCallback } from "react"
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

export function Level7EmojiRain() {
  const { completeLevel } = useGameStore()
  const [emojis, setEmojis] = useState<FallingEmoji[]>([])
  const [found, setFound] = useState(false)
  const [missed, setMissed] = useState(0)
  const [showTryAgain, setShowTryAgain] = useState(false)

  const generateEmojis = useCallback(() => {
    const pool: FallingEmoji[] = []
    const totalEmojis = 80
    const specialIndex = Math.floor(Math.random() * totalEmojis) + 10

    for (let i = 0; i < totalEmojis; i++) {
      const isSpecial = i === specialIndex
      pool.push({
        id: i,
        emoji: isSpecial ? "🌹" : "❤️",
        x: Math.random() * 85 + 5,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 5,
        isSpecial,
      })
    }
    setEmojis(pool)
  }, [])

  useEffect(() => {
    generateEmojis()
  }, [generateEmojis])

  useEffect(() => {
    if (emojis.length === 0) return
    
    // Calculate when all emojis will finish falling
    const maxTime = Math.max(...emojis.map(e => (e.delay + e.duration) * 1000))
    
    const timer = setTimeout(() => {
      if (!found && !showTryAgain) {
        setShowTryAgain(true)
      }
    }, maxTime + 500) // Add 500ms buffer
    
    return () => clearTimeout(timer)
  }, [emojis, found, showTryAgain])

  const handleClick = (emoji: FallingEmoji) => {
    if (emoji.isSpecial) {
      setFound(true)
      setTimeout(() => completeLevel(7), 800)
    } else {
      const newMissed = missed + 1
      setMissed(newMissed)
      setEmojis((prev) => prev.filter((e) => e.id !== emoji.id))
      
      if (newMissed >= 3) {
        setShowTryAgain(true)
      }
    }
  }

  const handleRestart = () => {
    setMissed(0)
    setShowTryAgain(false)
    setFound(false)
    generateEmojis()
  }

  const getEmoji = (emoji: string) => {
    return (
      <span className="text-4xl select-none">
        {emoji}
      </span>
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
          Find the rose among the hearts!
        </p>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          Look carefully for the special rose 🌹
        </p>
        {missed > 0 && missed < 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-sans text-destructive mt-1"
          >
            Not that one! Keep looking... ({missed}/3 mistakes)
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {!found && !showTryAgain &&
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
              {getEmoji(emoji.emoji)}
            </motion.button>
          ))}
      </AnimatePresence>

      {showTryAgain && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-30"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: 3, duration: 0.5 }}
            className="text-7xl"
          >
            😢
          </motion.div>
          <p className="text-2xl font-serif text-foreground/80 mt-4 mb-2">
            {missed >= 3 ? "Too many mistakes!" : "You missed the rose!"}
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            {missed >= 3 ? "Try again and find the rose! 🌹" : "Be quicker next time! 🌹"}
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-sans shadow-lg hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </motion.div>
      )}

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
              className="text-7xl"
            >
              🌹
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
