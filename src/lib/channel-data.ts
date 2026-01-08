export interface Message {
  id: string
  authorId?: string      // 멤버 ID (멤버 데이터와 연결)
  author?: string        // 표시 이름 (authorId가 없을 때 사용, Bot 등)
  avatar?: string        // 프로필 이미지 (authorId가 없을 때 사용)
  content: string
  image?: string
  images?: string[]
  timestamp?: string     // 생략 시 자동 생성
  isBot?: boolean
  isVisitor?: boolean    // 방문자 메시지 여부
}

export interface QuestionPreset {
  id: string
  question: string
  answer: string
  image?: string
  images?: string[]
}

export interface ChannelData {
  id: string
  name: string
  order?: number
  icon?: string
  leaderId?: string       // 리더 멤버 ID (팀장/프로젝트장)
  leaderTitle?: string    // 리더 타이틀 (예: "팀장", "프로젝트장")
  history: Message[]
  presets?: QuestionPreset[]
  isContactForm?: boolean
}

export interface ChannelInfo {
  id: string
  name: string
  order: number
  icon: string
}

import { getAssetUrl } from "./assets"

// 시간을 한국어 형식으로 포맷 (오전/오후 HH:MM)
function formatTimeKorean(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours < 12 ? '오전' : '오후'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${period} ${displayHours}:${displayMinutes}`
}

// 메시지에 타임스탬프가 없으면 자동 생성 (1~2분 간격)
function generateTimestamps(messages: Message[]): Message[] {
  const now = new Date()
  const totalMessages = messages.length

  return messages.map((message, index) => {
    if (message.timestamp) {
      return message
    }

    // 마지막 메시지부터 현재 시간에 가깝게, 이전 메시지는 1~2분씩 과거로
    const minutesAgo = (totalMessages - 1 - index) * 1.5 // 평균 1.5분 간격
    const messageTime = new Date(now.getTime() - minutesAgo * 60 * 1000)

    return {
      ...message,
      timestamp: formatTimeKorean(messageTime)
    }
  })
}

// Fetch channel list from index.json
export async function fetchChannelList(): Promise<string[]> {
  const response = await fetch(getAssetUrl("/channels/index.json"))
  if (!response.ok) {
    throw new Error('Failed to fetch channel list')
  }
  return response.json()
}

// Fetch single channel data
export async function fetchChannelData(channelId: string): Promise<ChannelData> {
  const response = await fetch(getAssetUrl(`/channels/${channelId}.json`))
  if (!response.ok) {
    throw new Error(`Failed to fetch channel: ${channelId}`)
  }
  const data: ChannelData = await response.json()

  // 타임스탬프가 없는 메시지에 자동 생성
  data.history = generateTimestamps(data.history)

  return data
}

// Fetch all channels data
export async function fetchAllChannels(): Promise<Record<string, ChannelData>> {
  const channelIds = await fetchChannelList()
  const channels: Record<string, ChannelData> = {}

  const channelDataPromises = channelIds.map(async (id) => {
    const data = await fetchChannelData(id)
    return { id, data }
  })

  const results = await Promise.all(channelDataPromises)

  results.forEach(({ id, data }) => {
    channels[id] = data
  })

  return channels
}

// Get sorted channel info list for sidebar
export async function fetchChannelInfoList(): Promise<ChannelInfo[]> {
  const channelIds = await fetchChannelList()

  const channelInfoPromises = channelIds.map(async (id) => {
    const data = await fetchChannelData(id)
    return {
      id: data.id,
      name: data.name,
      order: data.order ?? 0,
      icon: data.icon ?? 'Hash'
    }
  })

  const channelInfos = await Promise.all(channelInfoPromises)

  // Sort by order
  return channelInfos.sort((a, b) => a.order - b.order)
}
