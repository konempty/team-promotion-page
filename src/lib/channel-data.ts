export interface Message {
  id: string
  authorId?: string      // 멤버 ID (멤버 데이터와 연결)
  author: string         // 표시 이름 (authorId가 없을 때 사용)
  avatar?: string        // 프로필 이미지 (authorId가 없을 때 사용)
  content: string
  image?: string
  images?: string[]
  timestamp: string
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

// Fetch channel list from index.json
export async function fetchChannelList(): Promise<string[]> {
  const response = await fetch('/channels/index.json')
  if (!response.ok) {
    throw new Error('Failed to fetch channel list')
  }
  return response.json()
}

// Fetch single channel data
export async function fetchChannelData(channelId: string): Promise<ChannelData> {
  const response = await fetch(`/channels/${channelId}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch channel: ${channelId}`)
  }
  return response.json()
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
