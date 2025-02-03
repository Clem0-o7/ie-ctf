// @/app/api/progress/route.ts
import { getUserProgress } from "@/lib/progress";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const progress = await getUserProgress();
    
    if (!progress) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}