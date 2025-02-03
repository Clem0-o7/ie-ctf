"use client"

import { useEffect, useState } from "react"
import { decryptFlag } from "@/lib/decryption"
import LetterGlitch from "@/components/LetterGlitch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FlagData {
  obfuscatedPart1: string
  obfuscatedPart2: string
}

export default function HiddenFlag() {
  const [flag, setFlag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const res = await fetch("/api/flags?level=6")
        const data: FlagData = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch flag")
        }

        const { obfuscatedPart1, obfuscatedPart2 } = data
        const decryptedFlag = decryptFlag(obfuscatedPart1, obfuscatedPart2, "ctfkey")
        setFlag(decryptedFlag)
      } catch (error: any) {
        setError(error.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchFlag()
  }, [])

  return (
    <>
      <LetterGlitch />
      <div className="min-h-screen flex flex-col items-center justify-center bg-black/80 text-green-500 p-4">
        <Card className="w-full max-w-md bg-black/60 border-green-500 shadow-lg shadow-green-500/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-green-400">
              {loading ? "Decrypting..." : "Access Granted"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <div className="space-y-4">
                <p className="text-yellow-400 text-center">
                  You&apos;ve successfully infiltrated the system and retrieved the flag!
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setRevealed(!revealed)}
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-green-500 transition-colors"
                  >
                    {revealed ? "Hide Flag" : "Reveal Flag"}
                  </Button>
                </div>
                {revealed && (
                  <p className="text-lg text-center font-mono bg-black/40 p-2 rounded">
                    <span className="text-yellow-400">{flag}</span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
