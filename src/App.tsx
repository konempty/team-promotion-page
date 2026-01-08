import { useState } from "react"
import DiscordLayout from "@/components/discord-layout"
import SplashScreen from "@/components/splash-screen"
import { Toaster } from "@/components/ui/toaster"
import { VisitorProvider } from "@/contexts/visitor-context"

function App() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <VisitorProvider>
      <DiscordLayout />
      <Toaster />
    </VisitorProvider>
  )
}

export default App
