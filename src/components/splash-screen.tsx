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
    }, 3500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50 transition-opacity duration-500 ${
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
          <p className="italic">Computers are incredibly fast, <span className="whitespace-nowrap">
               accurate and stupid.
            </span>
          </p>
          <p className="italic">Human beings are incredibly slow, inaccurate and brilliant.</p>
          <p className="italic font-semibold text-blue-300">
            Together they are powerful{" "}
            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(147,197,253,0.8)] whitespace-nowrap">
              Beyond Imagination.
            </span>
          </p>
        </blockquote>
      </div>
    </div>
  )
}
