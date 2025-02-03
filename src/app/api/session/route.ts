// @/app/api/session/route.ts
import { getCurrentUser, getHighestCompletedLevel, logout } from "@/lib/auth";
import { NextResponse } from "next/server";

interface User {
  id: string;
  name: string;
  email: string;
}

export async function GET() {
  try {
    const user: User | null = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    const highestLevel: number = await getHighestCompletedLevel(user);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        highestLevel,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Session check failed" },
      { status: 500 }
    );
  }
}

// POST request to handle logout and delete session
export async function POST() {
  try {
    await logout();
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}