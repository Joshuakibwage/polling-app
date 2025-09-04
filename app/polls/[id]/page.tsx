import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, MessageSquare } from 'lucide-react';

interface PollPageProps {
  params: {
    id: string;
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const poll = await db.getPoll(params.id);

  if (!poll) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Poll Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{poll.title}</CardTitle>
                {poll.description && (
                  <CardDescription className="text-base">
                    {poll.description}
                  </CardDescription>
                )}
              </div>
              {poll.category && (
                <Badge variant="secondary">{poll.category}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by {poll.created_by}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(poll.created_at)}</span>
              </div>
              {poll.expires_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Expires {formatDate(poll.expires_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Poll Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Poll Options
            </CardTitle>
            <CardDescription>
              {poll.allow_multiple_votes 
                ? "You can vote for multiple options" 
                : "Select one option to vote"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <span className="font-medium">{option.option_text}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Vote
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Poll Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Poll Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Visibility:</span>
                <Badge variant={poll.is_public ? "default" : "secondary"}>
                  {poll.is_public ? "Public" : "Private"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={poll.is_active ? "default" : "secondary"}>
                  {poll.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Voting:</span>
                <Badge variant={poll.allow_multiple_votes ? "default" : "secondary"}>
                  {poll.allow_multiple_votes ? "Multiple votes allowed" : "Single vote only"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}