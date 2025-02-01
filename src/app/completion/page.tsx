// @/app/completion/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompletionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 Congratulations!</h1>
        <p className="text-xl mb-8">
          You've completed all levels of the IE CTF challenge!
        </p>
        <div className="space-y-4">
          <p>
            Your completion time has been recorded. Thank you for participating!
          </p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}