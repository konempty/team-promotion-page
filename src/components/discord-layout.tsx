
import { useState } from "react"
import { Menu, Users, X } from "lucide-react"
import ChannelSidebar from "@/components/channel-sidebar"
import ChatArea from "@/components/chat-area"
import MemberSidebar from "@/components/member-sidebar"
import { cn } from "@/lib/utils"

export default function DiscordLayout() {
  const [activeChannel, setActiveChannel] = useState("team-intro")
  const [showChannelSidebar, setShowChannelSidebar] = useState(false)
  const [showMemberSidebar, setShowMemberSidebar] = useState(false)

  const handleChannelChange = (channel: string) => {
    setActiveChannel(channel)
    setShowChannelSidebar(false) // Close sidebar on mobile after selection
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 md:hidden z-40">
        <button
          onClick={() => setShowChannelSidebar(true)}
          className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <Menu className="w-5 h-5 text-sidebar-foreground" />
        </button>
        <h1 className="font-semibold text-sidebar-foreground">Beyond Imagination</h1>
        <button
          onClick={() => setShowMemberSidebar(true)}
          className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <Users className="w-5 h-5 text-sidebar-foreground" />
        </button>
      </div>

      {showChannelSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowChannelSidebar(false)} />
      )}

      {showMemberSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowMemberSidebar(false)} />
      )}

      {/* Left Sidebar - Channels */}
      <div
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:transform-none",
          showChannelSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <button
          onClick={() => setShowChannelSidebar(false)}
          className="absolute top-3 right-3 p-1 hover:bg-sidebar-accent rounded-md transition-colors md:hidden z-10"
        >
          <X className="w-5 h-5 text-sidebar-foreground" />
        </button>
        <ChannelSidebar activeChannel={activeChannel} onChannelChange={handleChannelChange} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 pt-12 md:pt-0">
        <ChatArea activeChannel={activeChannel} />
      </div>

      {/* Right Sidebar - Members */}
      <div
        className={cn(
          "fixed md:relative inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:transform-none",
          showMemberSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <button
          onClick={() => setShowMemberSidebar(false)}
          className="absolute top-3 left-3 p-1 hover:bg-sidebar-accent rounded-md transition-colors md:hidden z-10"
        >
          <X className="w-5 h-5 text-sidebar-foreground" />
        </button>
        <MemberSidebar />
      </div>
    </div>
  )
}
