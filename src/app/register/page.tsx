// @/app/register/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { RegisterInput, registerSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const validated = registerSchema.parse(data);
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(validated),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      router.push("/levels/0");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Register Number</label>
            <input
              name="registerNumber"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Department</label>
            <input
              name="department"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}