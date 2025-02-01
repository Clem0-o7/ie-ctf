// @/app/api/session/route.ts
import { getCurrentUser, getHighestCompletedLevel } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    const highestLevel = await getHighestCompletedLevel(user);

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