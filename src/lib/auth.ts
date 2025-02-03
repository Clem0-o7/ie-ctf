// @/lib/auth.ts
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const alg = "HS256";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secret);
    const userId = verified.payload.userId as string;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch {
    return null;
  }
}

export async function getHighestCompletedLevel(user: any): Promise<number> {
  const levels = [0, 1, 2, 3, 4, 5, 6];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (user[`level${i}`]) return i;
  }
  return 0;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}