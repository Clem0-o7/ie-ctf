"use client";

import { Button } from "@/components/ui/button";
import { LoginInput, loginSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LetterGlitch from "@/components/LetterGlitch";

export default function LoginPage() {
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
            const validated = loginSchema.parse(data);
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify(validated),
                headers: { "Content-Type": "application/json" },
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            const session = await fetch("/api/session").then((r) => r.json());
            router.push(`/levels/${session.user.highestLevel}`);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <LetterGlitch />
            <div className="max-w-md w-full p-8 bg-black/50 backdrop-blur-md rounded-lg shadow-lg z-10">
                <h1 className="text-3xl font-bold mb-6 text-white">Login</h1>
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 backdrop-blur-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full p-2 rounded bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-2 rounded bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
