import { decryptFlag } from "@/lib/decryption";

export async function GET(req: Request): Promise<Response> {
    try {
        const level = "4"; // Hardcoded level

        // Construct the absolute URL using `req.nextUrl.origin`
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const flagsApiUrl = new URL(`/api/flags?level=${level}`, baseUrl).toString();

        // Fetch the obfuscated flag parts
        const response = await fetch(flagsApiUrl);
        const data = await response.json();

        if (!response.ok || !data.obfuscatedPart1 || !data.obfuscatedPart2) {
            throw new Error(data.error || "Invalid flag data received");
        }

        const { obfuscatedPart1, obfuscatedPart2 } = data;
        const key = "ctfkey"; 

        // Decrypt the flag using the provided decryption logic
        const flag = decryptFlag(obfuscatedPart1, obfuscatedPart2, key);

        return new Response(JSON.stringify({ flag }), { status: 200 });
    } catch (error: any) {
        console.error("Error in hidden-flag API:", error.message); // Debugging log
        return new Response(JSON.stringify({ error: error.message || "Failed to decrypt flag" }), { status: 500 });
    }
}
