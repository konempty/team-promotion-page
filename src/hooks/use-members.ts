import { useState, useEffect, useCallback } from 'react'
import { type Member, fetchMembers } from '@/lib/member-data'

interface UseMembersResult {
  members: Member[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useMembers(): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchMembers()
      setMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load members'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  return {
    members,
    isLoading,
    error,
    refresh: loadMembers,
  }
}
