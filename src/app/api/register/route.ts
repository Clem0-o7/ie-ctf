// @/app/api/register/route.ts
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { registerSchema } from "@/lib/validation";
import { createSession, hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const hashedPassword = await hashPassword(data.password);

    const [user] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();

    await createSession(user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}