import type React from "react"
import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Message, ChannelData } from "@/lib/channel-data"
import QuestionPresets from "@/components/question-presets"
import { useToast } from "@/hooks/use-toast"
import { useVisitor } from "@/contexts/visitor-context"

interface ChatInputProps {
  channelData: ChannelData
  onNewMessage: (message: Message) => void
}

export default function ChatInput({ channelData, onNewMessage }: ChatInputProps) {
  const { toast } = useToast()
  const { visitorName } = useVisitor()
  const [inputValue, setInputValue] = useState("")
  const [email, setEmail] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const canUserType = channelData.isContactForm || false

  const handlePresetClick = (preset: {
    id: string
    question: string
    answer: string
    image?: string
    images?: string[]
  }) => {
    // Add user's question first
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: visitorName,
      content: preset.question,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isBot: false,
      isVisitor: true,
    }
    onNewMessage(userMessage)

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot typing and responding
    setTimeout(() => {
      setIsTyping(false)
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        author: "Bot",
        content: preset.answer,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
        }),
        isBot: true,
        image: preset.image,
        images: preset.images,
      }
      onNewMessage(botMessage)
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !email.trim()) {
      toast({
        title: "입력 오류",
        description: "이메일과 문의사항을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "이메일 형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: visitorName,
      content: `이메일: ${email}\n\n${inputValue}`,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isBot: false,
      isVisitor: true,
    }
    onNewMessage(userMessage)

    // Discord 웹훅으로 문의 전송
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "📬 새로운 문의가 도착했습니다!",
                color: 0x5865f2,
                fields: [
                  {
                    name: "회신 이메일",
                    value: email,
                    inline: true,
                  },
                  {
                    name: "문의 내용",
                    value: inputValue,
                  },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })

        setTimeout(() => {
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            author: "Bot",
            content: "문의가 정상적으로 전달되었습니다. 빠른 시일 내에 답변 드리겠습니다. 감사합니다! 📧",
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "2-digit",
            }),
            isBot: true,
          }
          onNewMessage(botMessage)
        }, 500)

        toast({
          title: "문의가 접수되었습니다",
          description: "빠른 시일 내에 답변 드리겠습니다.",
        })
      } catch {
        toast({
          title: "전송 실패",
          description: "문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
          variant: "destructive",
        })
        return
      }
    } else {
      toast({
        title: "설정 오류",
        description: "문의 기능이 현재 사용 불가능합니다.",
        variant: "destructive",
      })
      return
    }

    setInputValue("")
    setEmail("")
  }

  return (
    <div className="border-t border-border">
      <div className="p-4 space-y-3">
        {/* Typing Indicator - appears above presets */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
            </div>
            <span>Bot이 입력 중입니다...</span>
          </div>
        )}

        {/* Question Presets - Only show for non-contact channels, always at bottom */}
        {!channelData.isContactForm && channelData.presets && (
          <QuestionPresets presets={channelData.presets} onPresetClick={handlePresetClick} isTyping={isTyping} />
        )}

        {/* Input Form */}
        {channelData.isContactForm ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                이메일 주소
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-input border-0 focus-visible:ring-1"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
                문의사항
              </label>
              <Textarea
                id="message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="문의하실 내용을 입력해주세요..."
                className="bg-input border-0 focus-visible:ring-1 min-h-[100px] resize-none"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!inputValue.trim() || !email.trim()}>
              <Send className="w-4 h-4 mr-2" />
              문의 보내기
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              {!canUserType && (
                <div className="absolute inset-0 bg-input/50 backdrop-blur-sm rounded-md z-10 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">질문 프리셋을 선택해주세요</span>
                </div>
              )}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`${channelData.name}에 메시지 보내기`}
                disabled={!canUserType && !isTyping}
                className="bg-input border-0 focus-visible:ring-1"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
