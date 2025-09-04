'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/app/components/protected-route"
import { createPollSchema, type CreatePollInput } from "@/lib/validations/poll"

export default function CreatePollPage() {
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Filter out empty options
      const validOptions = options.filter(option => option.trim() !== "")
      
      if (validOptions.length < 2) {
        setError("At least 2 options are required")
        setLoading(false)
        return
      }

      // Prepare data for validation
      const pollData: CreatePollInput = {
        title: title.trim(),
        options: validOptions,
      }

      // Validate the data
      const validatedData = createPollSchema.parse(pollData)

      // Submit to API
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError)
        throw new Error('Invalid response from server. Please try again.')
      }

      if (!response.ok) {
        const errorMessage = result.details || result.error || 'Failed to create poll'
        throw new Error(errorMessage)
      }

      setSuccess("Poll created successfully!")
      
      // Redirect to the poll page after a short delay
      setTimeout(() => {
        router.push(`/polls/${result.poll.id}`)
      }, 1500)

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Poll</CardTitle>
            <CardDescription>
              Create a new poll to gather opinions from your audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Question *</Label>
                <Input 
                  id="title" 
                  placeholder="What's your favorite programming language?"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Options *</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        disabled={loading}
                        required
                      />
                      {options.length > 2 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon"
                          onClick={() => removeOption(index)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 10 && (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="mt-2" 
                    onClick={addOption}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Poll...
                  </>
                ) : (
                  'Create Poll'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
