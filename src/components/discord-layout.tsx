import { useState, useEffect } from "react"
import { Menu, Users, X } from "lucide-react"
import ChannelSidebar from "@/components/channel-sidebar"
import ChatArea from "@/components/chat-area"
import MemberSidebar from "@/components/member-sidebar"
import { cn } from "@/lib/utils"
import { useChannels } from "@/hooks/use-channels"
import type { ChannelData } from "@/lib/channel-data"

export default function DiscordLayout() {
  const { channels, isLoading, loadChannel } = useChannels()
  const [showChannelSidebar, setShowChannelSidebar] = useState(false)
  const [showMemberSidebar, setShowMemberSidebar] = useState(false)

  // Derive initial channel from loaded channels
  const initialChannel = channels.length > 0 ? channels[0].id : ""
  const [activeChannel, setActiveChannel] = useState<string>("")
  const [activeChannelData, setActiveChannelData] = useState<ChannelData | null>(null)

  // Use derived state for channel selection
  const currentChannel = activeChannel || initialChannel

  // Load channel data when channel changes
  useEffect(() => {
    if (currentChannel) {
      loadChannel(currentChannel).then(data => {
        if (data) {
          setActiveChannelData(data)
        }
      })
    }
  }, [currentChannel, loadChannel])

  const handleChannelChange = (channel: string) => {
    setActiveChannel(channel)
    setShowChannelSidebar(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">채널 로딩 중...</div>
      </div>
    )
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
        <ChannelSidebar
          channels={channels}
          activeChannel={currentChannel}
          onChannelChange={handleChannelChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 pt-12 md:pt-0">
        {activeChannelData ? (
          <ChatArea channelData={activeChannelData} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            채널을 선택해주세요
          </div>
        )}
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
