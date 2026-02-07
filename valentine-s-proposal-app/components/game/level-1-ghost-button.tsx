"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

export function Level1GhostButton() {
  const { completeLevel } = useGameStore()
  const [dodgeCount, setDodgeCount] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(false)
  const maxDodges = 5

  const getRandomPosition = useCallback(() => {
    const maxX = Math.min(window.innerWidth - 200, 600)
    const maxY = Math.min(window.innerHeight - 100, 500)
    return {
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY,
    }
  }, [])

  const handleHover = () => {
    if (caught) return
    if (dodgeCount < maxDodges - 1) {
      setDodgeCount((prev) => prev + 1)
      setPosition(getRandomPosition())
    } else {
      setDodgeCount(maxDodges)
      setCaught(true)
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleClick = () => {
    if (caught) {
      completeLevel(1)
    }
  }

  const teaseMessages = [
    "Try to catch me!",
    "Too slow!",
    "Almost!",
    "Haha, not yet!",
    "One more try...",
    "Okay okay, I'll stay!",
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl md:text-2xl font-serif text-center text-foreground/70"
      >
        {teaseMessages[dodgeCount]}
      </motion.p>

      <motion.button
        animate={position}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={handleHover}
        onTouchStart={handleHover}
        onClick={handleClick}
        whileHover={caught ? { scale: 1.1 } : {}}
        whileTap={caught ? { scale: 0.9 } : {}}
        className={`px-10 py-4 rounded-full text-lg font-sans shadow-lg transition-all ${
          caught
            ? "bg-primary text-primary-foreground shadow-xl cursor-pointer"
            : "bg-muted text-muted-foreground cursor-default"
        }`}
      >
        {caught ? "Click Me!" : "Start the Journey"}
      </motion.button>

      <div className="flex gap-2 mt-4">
        {Array.from({ length: maxDodges }).map((_, i) => (
          <motion.div
            key={`dodge-${i}-${dodgeCount}`}
            initial={{ scale: 0 }}
            animate={{ scale: i < dodgeCount ? 1 : 0.5 }}
            className={`w-3 h-3 rounded-full ${
              i < dodgeCount ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
