// @/app/api/submit-flag/route.ts
import { validateFlag } from "@/lib/flags";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { level, flag } = await req.json();
    
    if (typeof level !== 'number' || typeof flag !== 'string') {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // Validate level range
    if (level < 0 || level > 6) {
      return NextResponse.json(
        { error: "Invalid level" },
        { status: 400 }
      );
    }

    // Normalize flag format (uppercase, trim whitespace)
    const normalizedFlag = flag.trim().toUpperCase();
    
    // Validate flag format
    const flagFormat = /^[A-Z0-9]{6}-IE-[A-Z0-9]{6}$/;
    if (!flagFormat.test(normalizedFlag)) {
      return NextResponse.json(
        { error: "Invalid flag format. Expected: XXXXXX-IE-XXXXXX" },
        { status: 400 }
      );
    }

    const isValid = await validateFlag(level, normalizedFlag);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect flag" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      nextLevel: level < 6 ? level + 1 : null,
    });
  } catch (error: any) {
    console.error("Flag submission error:", error);
    return NextResponse.json(
      { error: error.message || "Flag submission failed" },
      { status: 500 }
    );
  }
}