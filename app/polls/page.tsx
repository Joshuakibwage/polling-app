import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "A survey to understand developer preferences",
    totalVotes: 156,
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Best framework for web development?",
    description: "Comparing popular web frameworks",
    totalVotes: 89,
    status: "active",
    createdAt: "2024-01-14"
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                <Badge variant={poll.status === "active" ? "default" : "secondary"}>
                  {poll.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>{poll.totalVotes} votes</span>
                <span>{poll.createdAt}</span>
              </div>
              <Link href={`/polls/${poll.id}`}>
                <Button variant="outline" className="w-full">
                  View Poll
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
