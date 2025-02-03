"use client";

import { LevelLayout } from "@/components/level-layout";
import { useState } from "react";

export default function Level6() {
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
        body: JSON.stringify({ level: 6, flag }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      if (data.success) {
        window.location.href = "/completion";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LevelLayout level={6}>
      <div className="prose text-white">
        <h2 className="text-2xl font-bold">Level 6: URL Manipulation</h2>
        <p>
          Similar to how some techies managed to secure Coldplay concert tickets in India by using the inspect element trick and finding hidden routes, the flag for this level is also hidden.
        </p>
        <p>
          The flag is accessible by navigating to a hidden URL path. Can you figure out which one it is?
        </p>
        <p className="mt-4">
          Hint: The route is the baseurl/[name of your favorite student chapter of TCE-CSE].😁😁😁
        </p>
        <p>
          PS.Opening a new tab might be faster
        </p>

        
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </LevelLayout>
  );
}
