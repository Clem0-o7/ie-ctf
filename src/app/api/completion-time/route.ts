import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request): Promise<NextResponse> {
    try {
        // Get the current user from the session
        const user = await getCurrentUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch the user details
        const { createdAt, finalSubmissionTime } = user;

        if (!finalSubmissionTime) {
            return NextResponse.json({ error: "Final submission time not found" }, { status: 400 });
        }

        // Calculate time difference in milliseconds
        const timeTaken = new Date(finalSubmissionTime).getTime() - new Date(createdAt).getTime();

        // Convert time difference to days, hours, minutes, and seconds
        const days = Math.floor(timeTaken / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeTaken % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeTaken % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeTaken % (1000 * 60)) / 1000);

        return NextResponse.json({ timeTaken: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds` });
    } catch (error) {
        console.error("Error fetching completion time:", error);
        return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
