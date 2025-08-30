import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Create a new poll to gather opinions from your audience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input 
              id="title" 
              placeholder="What's your favorite programming language?"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide more context about your poll..."
              className="w-full"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Poll Options</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Option 1" />
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Option 2" />
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Option 3" />
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="mt-2">
              Add Option
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button className="flex-1">Create Poll</Button>
            <Button variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
