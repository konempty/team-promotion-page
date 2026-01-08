
import { Hash } from "lucide-react"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import { channelData } from "@/lib/channel-data"
import { useState } from "react"
import type { Message } from "@/lib/channel-data"

interface ChatAreaProps {
  activeChannel: string
}

export default function ChatArea({ activeChannel }: ChatAreaProps) {
  const channel = channelData[activeChannel]
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>({})

  const handleNewMessage = (message: Message) => {
    setChannelMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), message],
    }))
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-[calc(100vh-3rem)] md:h-screen">
      {/* Channel Header - hidden on mobile since we have top bar */}
      <div className="h-12 px-4 items-center border-b border-border shadow-sm hidden md:flex">
        <Hash className="w-5 h-5 text-muted-foreground mr-2" />
        <h2 className="font-semibold text-foreground">{channel.name}</h2>
      </div>

      <div className="h-10 px-4 flex items-center border-b border-border md:hidden">
        <Hash className="w-4 h-4 text-muted-foreground mr-2" />
        <h2 className="font-medium text-sm text-foreground">{channel.name}</h2>
      </div>

      {/* Messages Area */}
      <ChatMessages activeChannel={activeChannel} newMessages={channelMessages[activeChannel] || []} />

      {/* Input Area */}
      <ChatInput activeChannel={activeChannel} onNewMessage={handleNewMessage} />
    </div>
  )
}
