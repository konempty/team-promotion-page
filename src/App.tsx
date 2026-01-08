import { useState } from "react"
import DiscordLayout from "@/components/discord-layout"
import SplashScreen from "@/components/splash-screen"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <>
      <DiscordLayout />
      <Toaster />
    </>
  )
}

export default App
