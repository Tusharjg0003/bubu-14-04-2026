"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

export function Level5Password() {
  const { completeLevel } = useGameStore()
  const [input, setInput] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)
  const [completed, setCompleted] = useState(false)

  const correctAnswers = ["I will protect","i will protect"]

  const hints = [
    "Think about what I first told you that made you happy.",
    "It's something sweet and affectionate...",
    "Hint: It's something I often tell you that you love to hear.",
    "Try: I .... .......",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim().toLowerCase()
    if (correctAnswers.includes(trimmed)) {
      setCompleted(true)
      setTimeout(() => completeLevel(5), 1000)
    } else {
      setAttempts((prev) => prev + 1)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xl md:text-2xl font-serif text-foreground/70">
          3 Words - Guess the Secret Phrase
        </p>
        <AnimatePresence mode="wait">
          {attempts > 0 && (
            <motion.p
              key={attempts}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-sans text-muted-foreground mt-3"
            >
              {hints[Math.min(attempts - 1, hints.length - 1)]}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type the secret nickname..."
            className="w-full px-6 py-4 rounded-2xl bg-card text-card-foreground border-2 border-border text-center text-lg font-sans placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            autoFocus
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans text-lg shadow-lg"
        >
          Unlock
        </motion.button>
      </motion.form>

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-serif text-primary">
            You got it right!
          </p>
        </motion.div>
      )}

      <div className="flex gap-1 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`lock-${i}`}
            className={`w-2 h-2 rounded-full ${
              i < attempts ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
