"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PollWithOptions } from "@/lib/types/database";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { User } from "@/lib/types/auth";

export default function PollsPage() {
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch polls and user data in parallel
        const [pollsRes, userRes] = await Promise.all([
          fetch("/api/polls"),
          fetch("/api/auth/me"),
        ]);

        if (!pollsRes.ok) {
          const errorData = await pollsRes.json();
          throw new Error(errorData.error || "Failed to fetch polls.");
        }

        // User might not be logged in, which is okay.
        const userData = userRes.ok ? await userRes.json() : { user: null };
        const pollsData = await pollsRes.json();

        setPolls(pollsData.polls);
        setUser(userData.user);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) {
      return;
    }

    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete poll.");
      }

      // Update state to remove the deleted poll
      setPolls((prevPolls) => prevPolls.filter((p) => p.id !== pollId));
    } catch (err) {
      // Use a more user-friendly error display than alert
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin inline-block" />
        <p>Loading polls...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-4 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card
              key={poll.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4">
                    {poll.options.length} options
                  </p>
                </div>
                <div className="space-y-2">
                  <Link href={`/polls/${poll.id}`}>
                    <Button variant="outline" className="w-full">
                      View Poll
                    </Button>
                  </Link>
                  {user && user.id === poll.created_by && (
                    <div className="flex gap-2 mt-2">
                      <Link href={`/polls/${poll.id}/edit`} className="w-full">
                        <Button variant="secondary" className="w-1/2">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="1/2"
                        onClick={() => handleDelete(poll.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No polls yet</h2>
          <p className="text-gray-600 mb-4">
            Be the first to create a poll and gather opinions!
          </p>
          <Link href="/polls/create">
            <Button>Create a Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
