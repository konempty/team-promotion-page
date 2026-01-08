import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getAssetUrl } from "@/lib/assets"
import { useMembers } from "@/hooks/use-members"
import type { Member } from "@/lib/member-data"

export default function MemberSidebar() {
  const { members, isLoading } = useMembers()

  const onlineMembers = members.filter((m) => m.status === "online")
  const offlineMembers = members.filter((m) => m.status === "offline")

  if (isLoading) {
    return (
      <div className="w-60 h-screen bg-sidebar flex flex-col border-l border-sidebar-border">
        <div className="flex-1 overflow-y-auto p-4 pt-12 md:pt-4">
          <div className="text-sm text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-60 h-screen bg-sidebar flex flex-col border-l border-sidebar-border">
      <div className="flex-1 overflow-y-auto p-4 pt-12 md:pt-4">
        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              현재 팀 인원 — {onlineMembers.length}
            </h3>
            <div className="space-y-2">
              {onlineMembers.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              탈퇴 인원 — {offlineMembers.length}
            </h3>
            <div className="space-y-2">
              {offlineMembers.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MemberItem({ member }: { member: Member }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-sidebar-accent transition-colors group">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src={getAssetUrl(member.avatar || "/placeholder-user.jpg")} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {member.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sidebar",
                member.status === "online"
                  ? "bg-(--color-online-status)"
                  : "bg-(--color-offline-status)",
              )}
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">{member.name}</div>
            <div className="text-xs text-muted-foreground truncate">{member.role}</div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent side="left" align="start" className="w-72 md:w-80 bg-card border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-14 h-14 md:w-16 md:h-16">
                <AvatarImage src={getAssetUrl(member.avatar || "/placeholder-user.jpg")} />
                <AvatarFallback className="bg-primary text-primary-foreground text-base md:text-lg">
                  {member.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-card",
                  member.status === "online"
                    ? "bg-(--color-online-status)"
                    : "bg-(--color-offline-status)",
                )}
              />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">소개</h5>
            <p className="text-sm text-card-foreground leading-relaxed">{member.bio}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
