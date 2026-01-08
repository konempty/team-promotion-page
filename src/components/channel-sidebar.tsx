import { Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChannelSidebarProps {
  activeChannel: string
  onChannelChange: (channel: string) => void
}

const channels = [
  { id: "team-intro", name: "팀 소개", icon: Hash },
  { id: "beyondworm", name: "BeyondWorm 소개", icon: Hash },
  { id: "express-cargo", name: "Express Cargo 소개", icon: Hash },
  { id: "contact", name: "문의하기", icon: Hash },
]

export default function ChannelSidebar({ activeChannel, onChannelChange }: ChannelSidebarProps) {
  return (
    <div className="w-60 h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center gap-2 border-b border-sidebar-border shadow-sm hover:bg-sidebar-accent cursor-pointer transition-colors">
        <div className="relative w-8 h-8 flex-shrink-0">
          <img src="/beyond_imagination.png" alt="Beyond Imagination Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="font-semibold text-sidebar-foreground">Beyond Imagination</h1>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="px-2 mb-2">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">채널</div>
        </div>

        <div className="space-y-0.5 px-2">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <button
                key={channel.id}
                onClick={() => onChannelChange(channel.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                  activeChannel === channel.id && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{channel.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
