"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

const ICONS = [
  { id: "star", label: "Star", path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { id: "heart", label: "Heart", path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
  { id: "flower", label: "Flower", path: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm0-18C9.24 4 7 6.24 7 9c0 2.85 2.92 5.64 5 7.5 2.08-1.86 5-4.65 5-7.5 0-2.76-2.24-5-5-5z" },
  { id: "moon", label: "Moon", path: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" },
  { id: "diamond", label: "Diamond", path: "M12 2L2 12l10 10 10-10L12 2z" },
  { id: "rose", label: "Rose", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
  { id: "ring", label: "Ring", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" },
  { id: "music", label: "Music", path: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" },
  { id: "key", label: "Key", path: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
]

const correctOrder = ["heart", "rose", "ring"]

export function Level6PatternMatch() {
  const { completeLevel } = useGameStore()
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleClick = (iconId: string) => {
    if (completed) return
    if (selected.includes(iconId)) return

    const newSelected = [...selected, iconId]
    const currentIndex = newSelected.length - 1

    if (newSelected[currentIndex] !== correctOrder[currentIndex]) {
      setError(true)
      setTimeout(() => {
        setSelected([])
        setError(false)
      }, 600)
      return
    }

    setSelected(newSelected)

    if (newSelected.length === correctOrder.length) {
      setCompleted(true)
      setTimeout(() => completeLevel(6), 1000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xl md:text-2xl font-serif text-foreground/70">
          Tap the right pattern of love!
        </p>
        <p className="text-sm font-sans text-muted-foreground mt-2">
          Find the correct 3-icon sequence
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-2"
      >
        {correctOrder.map((id, i) => {
          const icon = ICONS.find((ic) => ic.id === id)
          return (
            <div
              key={`hint-${id}`}
              className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                selected.length > i
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <span className="text-xs font-sans text-muted-foreground">
                {icon?.label}
              </span>
            </div>
          )
        })}
      </motion.div>

      <motion.div
        animate={error ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        {ICONS.map((icon, i) => {
          const isSelected = selected.includes(icon.id)
          return (
            <motion.button
              key={icon.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleClick(icon.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors shadow-md ${
                isSelected
                  ? "bg-primary/20 border-2 border-primary"
                  : error
                    ? "bg-destructive/10 border-2 border-destructive/30"
                    : "bg-card border-2 border-border hover:border-primary/50"
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={isSelected ? "hsl(346, 77%, 60%)" : "hsl(340, 10%, 45%)"}>
                <path d={icon.path} />
              </svg>
              <span className="text-xs font-sans text-muted-foreground">{icon.label}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {completed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-serif text-primary"
        >
          Perfect pattern!
        </motion.p>
      )}
    </div>
  )
}
