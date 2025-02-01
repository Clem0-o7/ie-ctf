// @/components/level-layout.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface LevelLayoutProps {
  level: number;
  children: React.ReactNode;
}

export function LevelLayout({ level, children }: LevelLayoutProps) {
  const router = useRouter();
  const [flag, setFlag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/submit-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        if (level === 6) {
          router.push("/completion");
        } else {
          router.push(`/levels/${level + 1}`);
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
          <h1 className="text-2xl font-bold">Level {level}</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          {children}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Submit Flag</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Flag:</label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter flag (e.g., ABCD12-IE-XYZ789)"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Flag"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}