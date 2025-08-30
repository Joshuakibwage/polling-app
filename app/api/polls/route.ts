import { NextRequest, NextResponse } from 'next/server'
import { createPollSchema } from '@/lib/validations/poll'

// Mock data - replace with actual database calls
let polls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "A survey to understand developer preferences",
    options: [
      { id: "1", text: "JavaScript", votes: 45, percentage: 28.8 },
      { id: "2", text: "Python", votes: 38, percentage: 24.4 },
      { id: "3", text: "TypeScript", votes: 32, percentage: 20.5 },
      { id: "4", text: "Rust", votes: 25, percentage: 16.0 },
      { id: "5", text: "Go", votes: 16, percentage: 10.3 }
    ],
    totalVotes: 156,
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    createdBy: "user1",
    isPublic: true,
    allowMultipleVotes: false
  }
]

export async function GET() {
  try {
    return NextResponse.json({ polls })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPollSchema.parse(body)
    
    // Create new poll with generated ID
    const newPoll = {
      id: Date.now().toString(),
      ...validatedData,
      options: validatedData.options.map((text, index) => ({
        id: (index + 1).toString(),
        text,
        votes: 0,
        percentage: 0
      })),
      totalVotes: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user1" // Replace with actual user ID from auth
    }
    
    polls.push(newPoll)
    
    return NextResponse.json(newPoll, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}
