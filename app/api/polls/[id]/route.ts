import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/database';
import { z } from 'zod';

const updatePollSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(200),
  options: z.array(z.string().min(1).max(100)).min(2, "At least 2 options are required"),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const poll = await db.getPoll(params.id);
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }
    return NextResponse.json({ poll });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poll = await db.getPoll(params.id);
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (poll.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updatePollSchema.parse(body);

    // This is a simplified update. A more robust solution would handle
    // adding/removing/updating options individually.
    // For now, we'll just update the title. A full options update is more complex.
    const updatedPoll = await db.updatePoll(params.id, { title: validatedData.title }, user.id);

    return NextResponse.json({ poll: updatedPoll, message: 'Poll updated successfully' });

  } catch (error) {
    console.error('Error updating poll:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update poll', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const poll = await db.getPoll(params.id);
      if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }

      if (poll.created_by !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await db.deletePoll(params.id, user.id);

      return NextResponse.json({ message: 'Poll deleted successfully' });

    } catch (error) {
      console.error('Error deleting poll:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: 'Failed to delete poll', details: errorMessage }, { status: 500 });
    }
  }
