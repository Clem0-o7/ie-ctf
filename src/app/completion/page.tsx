"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LetterGlitch from "@/components/LetterGlitch"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CompletionTimeResponse {
  timeTaken: string;
  error?: string;
}

export default function CompletionPage() {
  const [timeTaken, setTimeTaken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCompletionTime = async () => {
      try {
        const res = await fetch("/api/completion-time")
        const data: CompletionTimeResponse = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch completion time")
        }

        setTimeTaken(data.timeTaken)
      } catch (error: any) {
        setError(error.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchCompletionTime()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/session", { method: "POST" })
      const data: { error?: string } = await res.json()
  
      if (res.ok) {
        router.push("/")
      } else {
        setError(data.error || "Logout failed")
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong.")
    }
  }

  return (
    <>
      <LetterGlitch />
      <div className="min-h-screen flex items-center justify-center bg-black/80 text-green-500 p-4">
        <Card className="w-full max-w-2xl bg-black/60 border-green-500 shadow-lg shadow-green-500/20">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-green-400">🎉 Mission Accomplished</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl">You&apos;ve successfully completed all levels of the IE CTF challenge!</p>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="bg-black/40 p-4 rounded-md">
                  <p className="text-lg font-mono">
                    Time Taken: <span className="text-yellow-400">{timeTaken}</span>
                  </p>
                </div>
                <p className="text-lg">Your completion time has been recorded in the system. Well done, hacker!</p>
              </>
            )}
            <div className="space-y-4 pt-4">
              <Link href="/" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-black">Return to Command Center</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className="w-full bg-green-600 hover:bg-green-700 text-black"
                variant="outline"
              >
                Terminate Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
