import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { channelData, type Message } from "@/lib/channel-data"
import { useEffect, useRef } from "react"

interface ChatMessagesProps {
  activeChannel: string
  newMessages: Message[]
}

export default function ChatMessages({ activeChannel, newMessages }: ChatMessagesProps) {
  const channel = channelData[activeChannel]
  const messages = channel.history
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const allMessages = [...messages, ...newMessages]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [newMessages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {allMessages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

function MessageItem({ message }: { message: Message }) {
  return (
    <div className="flex gap-3 hover:bg-accent/30 -mx-2 px-2 py-1 rounded transition-colors">
      <Avatar className="w-10 h-10 mt-0.5">
        <AvatarImage src={message.avatar || "/placeholder.svg"} />
        <AvatarFallback
          className={message.isBot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
        >
          {message.author.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{message.author}</span>
          {message.isBot && (
            <span className="text-xs bg-primary px-1.5 py-0.5 rounded text-primary-foreground font-medium">BOT</span>
          )}
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
        <div className="text-foreground leading-relaxed mt-1">{message.content}</div>
        {message.image && (
          <div className="mt-2 relative w-full max-w-md h-48 rounded overflow-hidden">
            <img src={message.image || "/placeholder.svg"} alt="Message attachment" className="w-full h-full object-cover" />
          </div>
        )}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.images.map((img, index) => (
              <div key={index} className="relative w-full max-w-sm h-48 rounded overflow-hidden">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Message attachment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
