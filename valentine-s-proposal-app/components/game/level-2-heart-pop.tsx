"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface FloatingHeart {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function Level2HeartPop() {
  const { completeLevel } = useGameStore()
  const [hearts, setHearts] = useState<FloatingHeart[]>([])
  const [popped, setPopped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameOver, setGameOver] = useState(false)
  const total = 13

  const generateHearts = useCallback(() => {
    const generated: FloatingHeart[] = Array.from({ length: total }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size: Math.random() * 20 + 30,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 3,
    }))
    setHearts(generated)
  }, [])

  useEffect(() => {
    generateHearts()
  }, [generateHearts])

  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver])

  const popHeart = useCallback(
    (id: number) => {
      if (gameOver) return
      setHearts((prev) => prev.filter((h) => h.id !== id))
      const newPopped = popped + 1
      setPopped(newPopped)
      if (newPopped >= total) {
        setTimeout(() => completeLevel(2), 500)
      }
    },
    [popped, gameOver, completeLevel]
  )

  const handleRestart = () => {
    setPopped(0)
    setTimeLeft(15)
    setGameOver(false)
    generateHearts()
  }

  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <p className="text-lg font-sans text-foreground/60">
          Pop all the hearts!
        </p>
        <p className="text-3xl font-serif text-primary font-bold mt-1">
          {popped} / {total}
        </p>
        <p className={`text-2xl font-bold mt-2 ${timeLeft <= 5 ? 'text-destructive' : 'text-foreground/70'}`}>
          ⏱️ {timeLeft}s
        </p>
      </motion.div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20"
          >
            <p className="text-3xl font-serif text-destructive mb-2">Time's Up!</p>
            <p className="text-xl text-foreground/70 mb-6">Try Again</p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-sans shadow-lg hover:scale-105 transition-transform"
            >
              Restart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.button
            key={heart.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [1, 1.1, 1],
              y: [0, -15, 0],
            }}
            exit={{
              scale: [1.5, 0],
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            transition={{
              delay: heart.delay,
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: heart.duration,
                ease: "easeInOut",
              },
              scale: {
                repeat: Number.POSITIVE_INFINITY,
                duration: heart.duration * 0.8,
                ease: "easeInOut",
              },
            }}
            onClick={() => popHeart(heart.id)}
            className="absolute cursor-pointer select-none"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              fontSize: `${heart.size}px`,
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.5 }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill="hsl(346, 77%, 60%)"
              className="drop-shadow-lg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
