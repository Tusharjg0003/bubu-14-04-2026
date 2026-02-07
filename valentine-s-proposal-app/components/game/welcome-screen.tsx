"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface BgHeart {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
}

export function WelcomeScreen() {
  const { goToLevel } = useGameStore()
  const [hearts, setHearts] = useState<BgHeart[]>([])

  useEffect(() => {
    setHearts(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 20 + 12,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 text-center">
      {/* Floating hearts background */}
      {hearts.map((h) => (
        <motion.div
          key={`bg-heart-${h.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="hsl(346, 77%, 60%)"
            opacity="0.15"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)" className="mx-auto drop-shadow-lg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
      >
        Hey Riya,
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg md:text-xl font-sans text-muted-foreground max-w-md leading-relaxed"
      >
        I made something special just for you. But first,
        you'll have to prove you're worthy of the surprise!
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-sm font-sans text-muted-foreground"
      >
        9 levels stand between you and the final question...
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => goToLevel(1)}
        className="mt-4 px-10 py-4 rounded-full bg-primary text-primary-foreground font-sans text-lg shadow-xl hover:shadow-2xl transition-shadow"
      >
        Begin the Adventure
      </motion.button>
    </div>
  )
}
