import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Initialize JWT secret
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAuth(request: NextRequest) {
    const token = request.cookies.get("session")?.value;

    if (!token) {
        return null;
    }

    try {
        const verified = await jwtVerify(token, secret);
        const userId = verified.payload.userId as string;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1) as unknown as { [key: string]: boolean | string }[];

        return user;
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow public assets and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static')
    ) {
        return NextResponse.next();
    }

    // Get authenticated user
    const user = await verifyAuth(request);
    
    // Handle authentication for protected routes
    if (pathname.startsWith('/levels') || pathname === '/completion') {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (pathname.startsWith('/levels/')) {
            const level = parseInt(pathname.split('/').pop() || '0');
        
            // Validate level number
            if (isNaN(level) || level < 0 || level > 6) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        
            // Allow access to level 0 (tutorial) for all authenticated users
            if (level === 0) {
                return NextResponse.next();
            }
        
            // Check if the previous level is completed
            const previousLevelComplete = user[`level${level - 1}` as keyof typeof user];
        
            if (!previousLevelComplete) {
                // Find the first uncompleted level
                let nextLevel = 0;
                for (let i = 0; i <= 6; i++) {
                    if (!user[`level${i}`]) {
                        nextLevel = i;
                        break;
                    }
                }
                
                // Redirect to the next uncompleted level
                return NextResponse.redirect(new URL(`/levels/${nextLevel}`, request.url));
            }
        }
        

        // Protect completion page
        if (pathname === '/completion' && !user.level6) {
            const highestLevel = [5, 4, 3, 2, 1, 0].find(
                level => user[`level${level}`]
            ) ?? 0;
            return NextResponse.redirect(
                new URL(`/levels/${highestLevel}`, request.url)
            );
        }
    }

    // Handle authentication pages for logged-in users
    if (pathname === '/login' || pathname === '/register') {
        if (user) {
            // Find highest incomplete level
            let nextLevel = 0;
            for (let i = 0; i <= 6; i++) {
                if (!user[`level${i}`]) {
                    nextLevel = i;
                    break;
                }
            }
            return NextResponse.redirect(new URL(`/levels/${nextLevel}`, request.url));
        }
    }

    // Allow access to home page and other public routes
    if (pathname === '/') {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

