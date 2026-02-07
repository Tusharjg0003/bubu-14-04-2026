"use client"

import { motion } from "framer-motion"
import { useGameStore, REVEAL_IMAGES, type Level } from "@/lib/game-store"
import Image from "next/image"

export function LevelReveal({ level }: { level: number }) {
  const { goToLevel } = useGameStore()
  const imageSrc = REVEAL_IMAGES[level]
  const nextLevel = (level + 1) as Level

  const messages: Record<number, string> = {
    1: "You found me! Just like you always do...",
    2: "Every heartbeat is for you.",
    3: "Infinity wouldn't be enough.",
    4: "Beneath it all, it's always you.",
    5: "You know me better than anyone.",
    6: "Our love is a beautiful pattern.",
    7: "You're my one in a million.",
    8: "The key to my heart is yours.",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-6 p-6"
    >
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl font-serif text-center text-foreground/80 italic max-w-md"
      >
        {messages[level]}
      </motion.p>

      {imageSrc && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="relative w-72 h-52 md:w-96 md:h-72 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`Reveal for level ${level}`}
            fill
            className="object-cover"
          />
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => goToLevel(nextLevel)}
        className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans text-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {level === 9 ? "The Finale Awaits..." : "Continue to Next Level"}
      </motion.button>
    </motion.div>
  )
}
