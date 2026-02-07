"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

export function Level3LoveSlider() {
  const { completeLevel } = useGameStore()
  const [value, setValue] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value)
    setValue(newVal)
    if (newVal >= 100 && !completed) {
      setCompleted(true)
      setTimeout(() => completeLevel(3), 800)
    }
  }

  const getMessage = () => {
    if (value < 20) return "Come on, you can do better..."
    if (value < 40) return "Getting warmer..."
    if (value < 60) return "That's more like it!"
    if (value < 80) return "Almost there..."
    if (value < 100) return "Just a little more!"
    return "To infinity and beyond!"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 w-full max-w-md mx-auto">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-serif text-center text-foreground/70"
      >
        How much do you love me?
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full flex flex-col items-center gap-4"
      >
        <motion.span
          key={getMessage()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-sans text-muted-foreground text-center"
        >
          {getMessage()}
        </motion.span>

        <div className="w-full relative">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(346, 77%, 60%) 0%, hsl(346, 77%, 60%) ${value}%, hsl(340, 15%, 88%) ${value}%, hsl(340, 15%, 88%) 100%)`,
            }}
          />
        </div>

        <motion.span
          animate={{
            scale: completed ? [1, 1.3, 1] : 1,
            color: completed ? "hsl(346, 77%, 60%)" : "hsl(340, 20%, 15%)",
          }}
          className="text-4xl md:text-5xl font-serif font-bold"
        >
          {completed ? "1000%" : `${value}%`}
        </motion.span>
      </motion.div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={`star-${i}`}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}
