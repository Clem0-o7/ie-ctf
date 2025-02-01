// @/app/api/debug-data/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    debug: true,
    environment: "development",
    secretFlag: "NETW0K-IE-PWN123",
    timestamp: new Date().toISOString()
  });
}