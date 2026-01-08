"use client"

import { useState } from "react"
import DiscordLayout from "@/components/discord-layout"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return <DiscordLayout />
}
