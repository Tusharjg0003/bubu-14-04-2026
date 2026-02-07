"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Phase = "error" | "question" | "accepted"

export function Finale() {
  const [phase, setPhase] = useState<Phase>("error")
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [noPresses, setNoPresses] = useState(0)
  const [yesScale, setYesScale] = useState(1)

  const noMessages = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you being serious?",
    "This is your final answer?",
    "You're breaking my heart...",
    "I'm gonna cry...",
    "Okay fine, I won't ask again...",
    "Just kidding, PLEASE?",
    "I'll be really sad...",
  ]

  const moveNoButton = useCallback(() => {
    const maxX = Math.min(window.innerWidth - 160, 250)
    const maxY = Math.min(window.innerHeight - 80, 200)
    setNoButtonPos({
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY,
    })
    setNoPresses((prev) => {
      const next = prev + 1
      setYesScale(1 + next * 0.15)
      return next
    })
  }, [])

  const handleYes = () => {
    setPhase("accepted")
  }

  const floatingHearts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4,
    size: Math.random() * 16 + 10,
  }))

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background hearts */}
      {phase !== "error" &&
        floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute pointer-events-none"
            style={{ left: `${h.x}%` }}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
            transition={{
              delay: h.delay,
              duration: h.duration,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)" opacity="0.4">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}

      <AnimatePresence mode="wait">
        {/* Phase 1: System Error */}
        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-card rounded-2xl shadow-2xl p-8 max-w-sm mx-4 border-2 border-destructive/50 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: 3, duration: 0.3 }}
              className="mb-4"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(0, 84.2%, 60.2%)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-serif font-bold text-destructive mb-2">
              SYSTEM ERROR
            </h2>
            <p className="font-sans text-card-foreground mb-6">
              Warning: Love levels exceeding maximum capacity!
            </p>
            <p className="text-sm font-sans text-muted-foreground mb-6">
              Error Code: LOVE_OVERFLOW_4EVER
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase("question")}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-sans shadow-lg"
            >
              Proceed to Final Screen
            </motion.button>
          </motion.div>
        )}

        {/* Phase 2: The Question */}
        {phase === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 px-6 text-center z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance"
            >
              Riya Salian,
              <br />
              will you be my Valentine?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 relative"
            >
              <motion.button
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale + 0.1 }}
                whileTap={{ scale: yesScale - 0.1 }}
                onClick={handleYes}
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-sans text-xl shadow-xl z-10"
              >
                Yes!
              </motion.button>

              <motion.button
                animate={noButtonPos}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onHoverStart={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton}
                className="px-8 py-4 rounded-full bg-muted text-muted-foreground font-sans text-base shadow-md"
                style={{ fontSize: Math.max(8, 16 - noPresses) }}
              >
                {noMessages[Math.min(noPresses, noMessages.length - 1)]}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: Accepted! */}
        {phase === "accepted" && (
          <motion.div
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 px-6 text-center z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="hsl(346, 77%, 60%)" className="drop-shadow-xl">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-5xl font-serif font-bold text-foreground"
            >
              I knew you'd say yes!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl font-serif text-foreground/70 italic max-w-md"
            >
              You just made me the happiest person alive. I love you bubu.
              Happy Valentine's Day!
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4"
            >
              <p className="text-sm font-sans text-muted-foreground">
                Forever and always yours
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
