// @/app/api/logout/route.ts
import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  logout();
  return NextResponse.json({ success: true });
}