import { Hash, Info } from "lucide-react"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import { useState } from "react"
import type { Message, ChannelData } from "@/lib/channel-data"

interface ChatAreaProps {
  channelData: ChannelData
}

export default function ChatArea({ channelData }: ChatAreaProps) {
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>({})

  const handleNewMessage = (message: Message) => {
    setChannelMessages((prev) => ({
      ...prev,
      [channelData.id]: [...(prev[channelData.id] || []), message],
    }))
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-[calc(100vh-3rem)] md:h-screen">
      {/* Channel Header - hidden on mobile since we have top bar */}
      <div className="h-12 px-4 items-center border-b border-border shadow-sm hidden md:flex">
        <Hash className="w-5 h-5 text-muted-foreground mr-2" />
        <h2 className="font-semibold text-foreground">{channelData.name}</h2>
      </div>

      <div className="h-10 px-4 flex items-center border-b border-border md:hidden">
        <Hash className="w-4 h-4 text-muted-foreground mr-2" />
        <h2 className="font-medium text-sm text-foreground">{channelData.name}</h2>
      </div>

      {/* Notice Banner */}
      <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
        <Info className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          이 페이지는 팀 홍보 FAQ 페이지입니다. 질문 버튼을 눌러도 실시간 채팅은 되지 않아요.
        </p>
      </div>

      {/* Messages Area */}
      <ChatMessages channelData={channelData} newMessages={channelMessages[channelData.id] || []} />

      {/* Input Area - key resets component state when channel changes */}
      <ChatInput key={channelData.id} channelData={channelData} onNewMessage={handleNewMessage} />
    </div>
  )
}
