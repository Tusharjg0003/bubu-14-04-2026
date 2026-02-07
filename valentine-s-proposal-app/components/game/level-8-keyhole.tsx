"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface Card {
  id: number
  hasKey: boolean
  isFlipped: boolean
}

export function Level8Keyhole() {
  const { completeLevel } = useGameStore()
  const [cards, setCards] = useState<Card[]>([])
  const [found, setFound] = useState(false)
  const [flips, setFlips] = useState(0)

  useEffect(() => {
    const keyPosition = Math.floor(Math.random() * 14)
    const initialCards: Card[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      hasKey: i === keyPosition,
      isFlipped: false,
    }))
    setCards(initialCards)
  }, [])

  const handleCardClick = useCallback(
    (id: number) => {
      if (found) return
      
      setCards((prev) => {
        const updated = prev.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
        
        const clickedCard = updated.find((c) => c.id === id)
        if (clickedCard?.hasKey) {
          setFound(true)
          setTimeout(() => completeLevel(8), 1500)
        }
        
        return updated
      })
      
      setFlips((prev) => prev + 1)
    },
    [found, completeLevel]
  )

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xl md:text-2xl font-serif text-foreground/70">
          {found ? "You found the key!" : "Find the key behind the hearts!"}
        </p>
        <p className="text-sm font-sans text-muted-foreground mt-2">
          {found ? "The key to my heart is yours!" : `Click the hearts to flip them - Flips: ${flips}`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 md:grid-cols-5 gap-3 max-w-2xl"
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square relative"
            style={{ perspective: "1000px" }}
          >
            <motion.button
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped}
              className="relative w-full h-full cursor-pointer disabled:cursor-default"
              animate={{ rotateY: card.isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card - Heart */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, hsl(346, 77%, 60%) 0%, hsl(346, 77%, 50%) 100%)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" opacity="0.9">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Back of card - Key or Empty */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: card.hasKey
                    ? "linear-gradient(135deg, hsl(45, 100%, 60%) 0%, hsl(45, 100%, 50%) 100%)"
                    : "linear-gradient(135deg, hsl(340, 20%, 94%) 0%, hsl(340, 20%, 88%) 100%)",
                }}
              >
                {card.hasKey ? (
                  <motion.svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="white"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </motion.svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(340, 10%, 65%)" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {found && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-lg font-serif text-primary">
            Found in {flips} {flips === 1 ? "flip" : "flips"}! 💖
          </p>
        </motion.div>
      )}
    </div>
  )
}
