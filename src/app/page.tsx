import { Button } from "@/components/ui/button"
import Link from "next/link"
import LetterGlitch from "@/components/LetterGlitch"

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <LetterGlitch />
      <div className="max-w-md w-full p-8 bg-black/50 backdrop-blur-md rounded-lg shadow-lg text-center z-10">
        <h1 className="text-6xl font-bold mb-6 text-white glitch-text">DECODE-X</h1>
        <p className="mb-8 text-gray-300">Capture all the flags!!! 
          <br />Brought to you by IE Student Chapter - TCE
        </p>
        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black mb-4">Login</Button>
          </Link>
          
          <Link href="/register">
            <Button className="w-full bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home;
