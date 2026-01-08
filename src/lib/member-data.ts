import { getAssetUrl } from "./assets"

export interface Member {
  id: string
  name: string
  role: string
  avatar?: string
  status: "online" | "offline"
  bio: string
}

export async function fetchMembers(): Promise<Member[]> {
  const response = await fetch(getAssetUrl("/members.json"))
  if (!response.ok) {
    throw new Error('Failed to fetch members')
  }
  return response.json()
}
