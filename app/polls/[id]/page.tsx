import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data - replace with actual data fetching
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "A survey to understand developer preferences and help guide our technology choices for future projects.",
  totalVotes: 156,
  status: "active",
  createdAt: "2024-01-15",
  options: [
    { id: "1", text: "JavaScript", votes: 45, percentage: 28.8 },
    { id: "2", text: "Python", votes: 38, percentage: 24.4 },
    { id: "3", text: "TypeScript", votes: 32, percentage: 20.5 },
    { id: "4", text: "Rust", votes: 25, percentage: 16.0 },
    { id: "5", text: "Go", votes: 16, percentage: 10.3 }
  ]
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/polls">
          <Button variant="outline" className="mb-4">
            ← Back to Polls
          </Button>
        </Link>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{mockPoll.title}</CardTitle>
                <CardDescription className="text-lg">
                  {mockPoll.description}
                </CardDescription>
              </div>
              <Badge variant={mockPoll.status === "active" ? "default" : "secondary"}>
                {mockPoll.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              Created on {mockPoll.createdAt} • {mockPoll.totalVotes} total votes
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mockPoll.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm text-gray-600">
                      {option.votes} votes ({option.percentage}%)
                    </span>
                  </div>
                  <Progress value={option.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Button className="w-full" size="lg">
                Vote Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
