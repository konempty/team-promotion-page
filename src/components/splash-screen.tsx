import { useEffect, useState } from "react"
import { getAssetUrl } from "@/lib/assets"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center max-w-2xl px-8">
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-2xl">
            <img
              src={getAssetUrl("/beyond_imagination.png")}
              alt="Beyond Imagination Logo"
              width={200}
              height={200}
              className="animate-pulse"
            />
          </div>
        </div>
        <blockquote className="text-slate-200 text-lg leading-relaxed space-y-2">
          <p className="italic">Computers are incredibly fast, accurate and stupid.</p>
          <p className="italic">Human beings are incredibly slow, inaccurate and brilliant.</p>
          <p className="italic font-semibold text-blue-300">Together they are powerful Beyond Imagination.</p>
          <footer className="text-slate-400 text-sm mt-4">- Albert Einstein -</footer>
        </blockquote>
      </div>
    </div>
  )
}
