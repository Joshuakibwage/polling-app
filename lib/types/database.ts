// lib/types/database.ts

export interface Poll {
  id: string;
  created_at: string;
  title: string;
  created_by: string;
}

export interface PollOption {
  id: string;
  created_at: string;
  text: string;
  poll_id: string;
}

export interface Vote {
  id: string;
  created_at: string;
  user_id: string;
  poll_id: string;
  option_id: string;
}

// Extended types
export interface PollWithOptions extends Poll {
  options: PollOption[];
}

// API request types
export interface CreatePollRequest {
  title: string;
  options: string[];
}

export interface UpdatePollRequest {
  title?: string;
}

export interface VoteRequest {
  poll_id: string;
  option_id: string;
}

// RPC function result types
export interface PollResult {
  option_id: string;
  text: string;
  vote_count: number;
}
