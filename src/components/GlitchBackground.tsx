"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useWindowSize } from "@/hooks/useWindowSize"

const GlitchBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { width, height } = useWindowSize()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = width
        canvas.height = height

        const fontSize = 20
        const columns = canvas.width / fontSize

        const drops: number[] = []
        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = "#0f0"
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.95 ? "1" : "0"
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }

                drops[i]++
            }
        }

        const interval = setInterval(draw, 33)

        return () => clearInterval(interval)
    }, [width, height])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}

export default GlitchBackground
