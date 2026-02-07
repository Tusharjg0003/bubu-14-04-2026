"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface PuzzlePiece {
  id: number
  rotation: number
  row: number
  col: number
}

export function Level9Puzzle() {
  const { completeLevel } = useGameStore()
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [completed, setCompleted] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const initial: PuzzlePiece[] = []
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const randomRotations = [90, 180, 270]
        initial.push({
          id: row * 2 + col,
          rotation: randomRotations[Math.floor(Math.random() * randomRotations.length)],
          row,
          col,
        })
      }
    }
    setPieces(initial)
  }, [])

  const checkComplete = useCallback(
    (currentPieces: PuzzlePiece[]) => {
      const allCorrect = currentPieces.every((p) => p.rotation % 360 === 0)
      if (allCorrect && !completed) {
        setCompleted(true)
        setTimeout(() => completeLevel(9), 1000)
      }
    },
    [completed, completeLevel]
  )

  const rotatePiece = (id: number) => {
    if (completed) return
    setMoves((prev) => prev + 1)
    setPieces((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, rotation: p.rotation + 90 } : p
      )
      setTimeout(() => checkComplete(updated), 100)
      return updated
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xl md:text-2xl font-serif text-foreground/70">
          Piece together our memory!
        </p>
        <p className="text-sm font-sans text-muted-foreground mt-2">
          Click each piece to rotate it into the correct position
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden shadow-2xl bg-border p-1">
          {pieces.map((piece) => (
            <motion.button
              key={piece.id}
              onClick={() => rotatePiece(piece.id)}
              animate={{ rotate: piece.rotation }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-36 h-36 md:w-44 md:h-44 overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: "url(/images/puzzle.PNG)",
                  backgroundPosition: `${piece.col * 100}% ${piece.row * 100}%`,
                  backgroundSize: "200% 200%",
                }}
              />
              {piece.rotation % 360 !== 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 text-sm font-sans text-muted-foreground"
      >
        <span>Moves: {moves}</span>
        <span>|</span>
        <span>
          {pieces.filter((p) => p.rotation % 360 === 0).length}/4 correct
        </span>
      </motion.div>

      {completed && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl font-serif text-primary"
        >
          You completed the puzzle!
        </motion.p>
      )}
    </div>
  )
}
