import { useState, useEffect, useCallback } from 'react'
import {
  type ChannelData,
  type ChannelInfo,
  fetchChannelInfoList,
  fetchChannelData,
} from '@/lib/channel-data'

interface UseChannelsResult {
  channels: ChannelInfo[]
  channelData: Record<string, ChannelData>
  isLoading: boolean
  error: Error | null
  loadChannel: (channelId: string) => Promise<ChannelData | null>
  refreshChannels: () => Promise<void>
}

export function useChannels(): UseChannelsResult {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [channelData, setChannelData] = useState<Record<string, ChannelData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadChannelList = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const channelInfos = await fetchChannelInfoList()
      setChannels(channelInfos)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load channels'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadChannel = useCallback(async (channelId: string): Promise<ChannelData | null> => {
    // Return cached data if available
    if (channelData[channelId]) {
      return channelData[channelId]
    }

    try {
      const data = await fetchChannelData(channelId)
      setChannelData(prev => ({ ...prev, [channelId]: data }))
      return data
    } catch (err) {
      console.error(`Failed to load channel: ${channelId}`, err)
      return null
    }
  }, [channelData])

  const refreshChannels = useCallback(async () => {
    // Clear cache and reload
    setChannelData({})
    await loadChannelList()
  }, [loadChannelList])

  useEffect(() => {
    loadChannelList()
  }, [loadChannelList])

  return {
    channels,
    channelData,
    isLoading,
    error,
    loadChannel,
    refreshChannels,
  }
}
