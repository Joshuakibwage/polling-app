'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { PollWithOptions } from '@/lib/types/database'

interface EditPollPageProps {
  params: {
    id: string;
  };
}

export default function EditPollPage({ params }: EditPollPageProps) {
  const [poll, setPoll] = useState<PollWithOptions | null>(null)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchPoll() {
      try {
        const response = await fetch(`/api/polls/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch poll data.')
        }
        const data = await response.json()
        setPoll(data.poll)
        setTitle(data.poll.title)
        setOptions(data.poll.options.map((o: any) => o.text))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      } finally {
        setLoading(false)
      }
    }
    fetchPoll()
  }, [params.id])

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const validOptions = options.filter(option => option.trim() !== '')
      if (validOptions.length < 2) {
        setError("At least 2 options are required")
        setSaving(false)
        return
      }

      const response = await fetch(`/api/polls/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), options: validOptions }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.details || result.error || 'Failed to update poll.')
      }

      setSuccess("Poll updated successfully!")
      setTimeout(() => {
        router.push(`/polls/${params.id}`)
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin inline-block" />
        <p>Loading poll...</p>
      </div>
    )
  }

  if (error && !poll) {
    return <div className="container mx-auto py-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
          <CardDescription>Update the details of your poll.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}
          {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Poll Question *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={saving}
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
                      required
                      disabled={saving}
                    />
                    {options.length > 2 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeOption(index)} disabled={saving}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 10 && (
                <Button type="button" variant="outline" className="mt-2" onClick={addOption} disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
