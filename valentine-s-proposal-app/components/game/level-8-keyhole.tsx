"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

interface Particle {
  id: number
  left: number
  top: number
}

export function Level8Keyhole() {
  const { completeLevel } = useGameStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [keyPos, setKeyPos] = useState({ x: 50, y: 50 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [ready, setReady] = useState(false)
  const [found, setFound] = useState(false)
  const [proximity, setProximity] = useState(0)

  useEffect(() => {
    setKeyPos({
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
    })
    setParticles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
      }))
    )
    setReady(true)
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || found) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100

      setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })

      const dist = Math.sqrt(
        Math.pow(x - keyPos.x, 2) + Math.pow(y - keyPos.y, 2)
      )
      setProximity(Math.max(0, 100 - dist * 2))

      if (dist < 8) {
        setFound(true)
        setTimeout(() => completeLevel(8), 1000)
      }
    },
    [keyPos, found, completeLevel]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [handleMove])

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-sans text-foreground/60 text-center z-10"
      >
        {found ? "You found the key!" : "Move around to find the hidden key..."}
      </motion.p>

      {!found && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: proximity > 20 ? 1 : 0.3 }}
          className="text-sm font-sans text-center z-10"
          style={{
            color: proximity > 60 ? "hsl(346, 77%, 60%)" : proximity > 30 ? "hsl(25, 80%, 55%)" : "hsl(340, 10%, 45%)",
          }}
        >
          {proximity > 60 ? "Very warm!" : proximity > 30 ? "Getting warmer..." : "Cold..."}
        </motion.div>
      )}

      <div
        ref={containerRef}
        className="relative w-full max-w-lg h-80 rounded-2xl overflow-hidden cursor-none touch-none"
        style={{
          background: "hsl(340, 20%, 8%)",
        }}
      >
        {/* Flashlight effect */}
        <div
          className="absolute inset-0 transition-none pointer-events-none"
          style={{
            background: found
              ? "transparent"
              : `radial-gradient(circle 80px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0,0,0,0.95) 100%)`,
          }}
        />

        {/* Hidden key */}
        <motion.div
          className="absolute"
          style={{
            left: `${keyPos.x}%`,
            top: `${keyPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={
            found
              ? {
                  scale: [1, 1.5, 1],
                  rotate: [0, 15, -15, 0],
                }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="hsl(25, 80%, 55%)" className="drop-shadow-lg">
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        </motion.div>

        {/* Ambient particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              delay: i * 0.5,
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        ))}
      </div>

      {found && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xl font-serif text-primary">The key to my heart is yours!</p>
        </motion.div>
      )}
    </div>
  )
}
