import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getAssetUrl, getThumbnailUrl } from "@/lib/assets"
import type { Message, ChannelData } from "@/lib/channel-data"
import type { Member } from "@/lib/member-data"
import { useMembers } from "@/hooks/use-members"
import { useEffect, useRef, useMemo, useState, type ReactNode } from "react"
import ImageModal from "@/components/image-modal"

// URL을 하이퍼링크로 변환
function linkify(text: string, keyPrefix: string): ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // URL 끝에 붙은 특수문자 제거 (마침표, 쉼표 등)
      const cleanUrl = part.replace(/[.,!?;:)\]}>]+$/, '')
      const trailing = part.slice(cleanUrl.length)
      return (
        <span key={`${keyPrefix}-${i}`}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {cleanUrl}
          </a>
          {trailing}
        </span>
      )
    }
    return part
  })
}

// \n을 줄바꿈으로 변환하고 URL을 링크로 변환
function formatContent(content: string): ReactNode {
  const lines = content.split('\n')

  return lines.map((line, index) => (
    <span key={index}>
      {linkify(line, `line-${index}`)}
      {index < lines.length - 1 && <br />}
    </span>
  ))
}

interface ChatMessagesProps {
  channelData: ChannelData
  newMessages: Message[]
}

export default function ChatMessages({ channelData, newMessages }: ChatMessagesProps) {
  const { members } = useMembers()
  const messages = channelData.history
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [modalImage, setModalImage] = useState<string | null>(null)

  const allMessages = [...messages, ...newMessages]

  // Create a member lookup map for efficient access
  const memberMap = useMemo(() => {
    const map = new Map<string, Member>()
    members.forEach(member => map.set(member.id, member))
    return map
  }, [members])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [newMessages])

  const handleImageClick = (src: string) => {
    setModalImage(src)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            memberMap={memberMap}
            leaderId={channelData.leaderId}
            leaderTitle={channelData.leaderTitle}
            onImageClick={handleImageClick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ImageModal
        src={modalImage || ""}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </>
  )
}

interface MessageItemProps {
  message: Message
  memberMap: Map<string, Member>
  leaderId?: string
  leaderTitle?: string
  onImageClick: (src: string) => void
}

function MessageItem({ message, memberMap, leaderId, leaderTitle, onImageClick }: MessageItemProps) {
  // Get member info if authorId exists
  const member = message.authorId ? memberMap.get(message.authorId) : undefined
  const isVisitor = message.isVisitor === true
  const isLeader = leaderId && message.authorId === leaderId

  // Use member data if available, otherwise fall back to message data
  const authorName = member?.name ?? message.author ?? "Unknown"
  // Bot uses team logo, otherwise use member avatar or message avatar
  const authorAvatar = message.isBot
    ? "/beyond_imagination.png"
    : (member?.avatar || message.avatar)

  // Show online status for members or visitors
  const showOnlineStatus = member || isVisitor

  const avatarElement = (
    <div className="relative">
      <Avatar className="w-10 h-10 cursor-pointer">
        <AvatarImage src={getThumbnailUrl(authorAvatar || "/placeholder-user.jpg")} />
        <AvatarFallback
          className={message.isBot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
        >
          {authorName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {showOnlineStatus && (
        <div
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
            isVisitor || member?.status === "online"
              ? "bg-(--color-online-status)"
              : "bg-(--color-offline-status)",
          )}
        />
      )}
    </div>
  )

  // Show popover for members or visitors
  const showPopover = member || isVisitor

  return (
    <div className="flex gap-3 hover:bg-accent/30 -mx-2 px-2 py-1 rounded transition-colors">
      {showPopover ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="focus:outline-none">
              {avatarElement}
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" sideOffset={8} collisionPadding={16} className="w-[calc(100vw-32px)] max-w-80 bg-card border-border">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative cursor-zoom-in hover:opacity-90 transition-opacity"
                  onClick={() => {
                    const avatarSrc = isVisitor ? "/placeholder-user.jpg" : (member?.avatar || "/placeholder-user.jpg")
                    onImageClick(getAssetUrl(avatarSrc)) // 원본 이미지로 모달 열기
                  }}
                >
                  <Avatar className="w-14 h-14 md:w-16 md:h-16">
                    <AvatarImage src={getThumbnailUrl(isVisitor ? "/placeholder-user.jpg" : (member?.avatar || "/placeholder-user.jpg"))} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-base md:text-lg">
                      {isVisitor ? authorName.slice(0, 2) : member?.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-card",
                      isVisitor || member?.status === "online"
                        ? "bg-(--color-online-status)"
                        : "bg-(--color-offline-status)",
                    )}
                  />
                </button>
                <div>
                  <h4 className="font-semibold text-card-foreground">{isVisitor ? authorName : member?.name}</h4>
                  <p className="text-sm text-muted-foreground">{isVisitor ? "Visitor" : member?.role}</p>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">소개</h5>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {isVisitor ? "새로운 사람은 언제나 환영이야!" : member?.bio}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        avatarElement
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{authorName}</span>
          {isLeader && leaderTitle && (
            <span className="text-sm text-muted-foreground">({leaderTitle})</span>
          )}
          {message.isBot && (
            <span className="text-xs bg-primary px-1.5 py-0.5 rounded text-primary-foreground font-medium">BOT</span>
          )}
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
        <div className="text-foreground leading-relaxed mt-1">{formatContent(message.content)}</div>
        {message.image && (
          <button
            type="button"
            onClick={() => onImageClick(getAssetUrl(message.image || ""))} // 원본 이미지로 모달 열기
            className="mt-2 relative w-full max-w-md h-48 rounded overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
          >
            <img src={getThumbnailUrl(message.image || "/placeholder.svg")} alt="Message attachment" className="w-full h-full object-cover" />
          </button>
        )}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.images.map((img, index) => (
              <button
                type="button"
                key={index}
                onClick={() => onImageClick(getAssetUrl(img || ""))} // 원본 이미지로 모달 열기
                className="relative w-full max-w-sm h-48 rounded overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
              >
                <img
                  src={getThumbnailUrl(img || "/placeholder.svg")}
                  alt={`Message attachment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
