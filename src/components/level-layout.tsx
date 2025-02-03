"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import GlitchBackground from "@/components/GlitchBackground";

interface LevelLayoutProps {
    level: number;
    children: React.ReactNode;
}

export function LevelLayout({ level, children }: LevelLayoutProps) {
    const router = useRouter();
    const [flag, setFlag] = useState<string>(""); // To store final flag after decryption
    const [error, setError] = useState<string>(""); // For error handling
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLevel, setSelectedLevel] = useState<number>(level);
    const [user, setUser] = useState<any>(null); // To store user data
    const [highestLevel, setHighestLevel] = useState<number>(0);

    useEffect(() => {
        // Fetch user data and highest level after component mounts
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/session");
                const data = await res.json();

                if (data.authenticated) {
                    setUser(data.user);
                    setHighestLevel(data.user.highestLevel);
                } else {
                    // Redirect to login if no user found
                    router.push("/login");
                }
            } catch {
                // Handle error in case of failed API call
                router.push("/login");
            }
        };

        fetchUserData();
    }, [router]);

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

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLevel = parseInt(e.target.value, 10);

        if (newLevel === 7) {
            // Completion level
            router.push("/completion");
        } else {
            // Check if the level is within the unlocked range
            if (newLevel <= highestLevel + 1) {  // Allow navigation to the next level too
                setSelectedLevel(newLevel);
                router.push(`/levels/${newLevel}`);
            } else {
                // If the user doesn\'t have access, bring them back to their last unlocked level
                setSelectedLevel(highestLevel);
                router.push(`/levels/${highestLevel}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <GlitchBackground />
            <div className="w-full max-w-4xl p-8 bg-black/50 backdrop-blur-md rounded-lg shadow-lg z-10">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/">
                        <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-black">
                            Home
                        </Button>
                    </Link>
                    {/* Level Dropdown */}
                    <select
                        value={selectedLevel}
                        onChange={handleLevelChange}
                        className="bg-black/30 text-white border border-gray-600 rounded p-2 focus:outline-none focus:border-green-500"
                    >
                        {[...Array(7).keys()].map((levelNum) => (
                            <option key={levelNum} value={levelNum}>
                                Level {levelNum}
                            </option>
                        ))}
                        <option value={7}>Completion</option>
                    </select>
                </div>

                <div className="bg-black/30 p-6 rounded-lg mb-8 text-white">{children}</div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 text-white">Submit Flag</h2>
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 backdrop-blur-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block mb-2 text-gray-300">Flag:</label>
                        <input
                            type="text"
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            className="w-full p-2 rounded bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                            placeholder="Enter flag (e.g., ABCD12-IE-XYZ789)"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
                    >
                        {loading ? "Submitting..." : "Submit Flag"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
