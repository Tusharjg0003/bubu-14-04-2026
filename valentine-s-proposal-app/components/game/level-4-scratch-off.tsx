"use client"

import React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/lib/game-store"

export function Level4ScratchOff() {
  const { completeLevel } = useGameStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 320
    canvas.height = 240

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = "#c4b5b0"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "bold 18px sans-serif"
      ctx.fillStyle = "#8a7a74"
      ctx.textAlign = "center"
      ctx.fillText("Scratch to reveal!", canvas.width / 2, canvas.height / 2 - 10)
      ctx.font = "14px sans-serif"
      ctx.fillText("Use your cursor or finger", canvas.width / 2, canvas.height / 2 + 15)

      ctx.globalCompositeOperation = "destination-out"
      setImageLoaded(true)
    }
    img.src = "/images/reveal-4.jpg"
  }, [])

  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current
      if (!canvas || !imageLoaded) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.fill()
    },
    [imageLoaded]
  )

  const calculatePercentage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparent = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++
    }
    const pct = Math.round((transparent / (pixels.length / 4)) * 100)
    setPercentage(pct)

    if (pct >= 70 && !completed) {
      setCompleted(true)
      setTimeout(() => completeLevel(4), 800)
    }
  }, [completed, completeLevel])

  const getPosition = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleStart = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true)
    const pos = getPosition(e)
    if (pos) scratch(pos.x, pos.y)
  }

  const handleMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return
    const pos = getPosition(e)
    if (pos) scratch(pos.x, pos.y)
  }

  const handleEnd = () => {
    setIsDrawing(false)
    calculatePercentage()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-serif text-center text-foreground/70"
      >
        Scratch to uncover the surprise!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src="/images/reveal-4.jpg"
          alt="Hidden reveal"
          className="w-80 h-60 object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-80 h-60 cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="w-40 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-sans text-muted-foreground">{percentage}%</span>
      </motion.div>

      {completed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-serif text-lg"
        >
          Beautiful! You revealed it!
        </motion.p>
      )}
    </div>
  )
}
