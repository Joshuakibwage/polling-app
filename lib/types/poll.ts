export interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  status: 'active' | 'draft' | 'closed'
  createdAt: string
  updatedAt: string
  createdBy: string
  isPublic: boolean
  allowMultipleVotes: boolean
  endDate?: string
}

export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface CreatePollRequest {
  title: string
  description: string
  options: string[]
  isPublic: boolean
  allowMultipleVotes: boolean
  endDate?: string
}

export interface VoteRequest {
  pollId: string
  optionIds: string[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}
