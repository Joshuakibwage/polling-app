import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type {
  Poll,
  Vote,
  CreatePollRequest,
  UpdatePollRequest,
  VoteRequest,
  PollWithOptions,
  PollResult,
} from "@/lib/types/database";

// Server-side database operations
export class DatabaseService {
  // Poll operations
  async createPoll(
    data: CreatePollRequest,
    userId: string,
  ): Promise<PollWithOptions> {
    const supabase = createClient();
    // Step 1: Insert the poll and get its ID
    const { data: pollData, error: pollInsertError } = await supabase
      .from("polls")
      .insert({
        title: data.title,
        created_by: userId,
      })
      .select("id")
      .single();

    if (pollInsertError) {
      console.error("Error inserting poll:", pollInsertError);
      throw new Error("Failed to create poll.", { cause: pollInsertError });
    }
    if (!pollData || !pollData.id) {
      throw new Error(
        "Failed to create poll: No ID returned after insert. Check RLS policies.",
      );
    }

    const pollId = pollData.id;

    // Step 2: Insert poll options
    const optionsToInsert = data.options.map((text) => ({
      poll_id: pollId,
      text: text,
    }));

    const { error: optionsInsertError } = await supabase
      .from("poll_options")
      .insert(optionsToInsert);

    if (optionsInsertError) {
      console.error("Error inserting poll options:", optionsInsertError);
      // Clean up the created poll
      await supabase.from("polls").delete().eq("id", pollId);
      throw new Error("Failed to create poll options.", {
        cause: optionsInsertError,
      });
    }

    // Step 3: Fetch the complete poll data
    const newPoll = await this.getPoll(pollId);

    if (!newPoll) {
      // This would be very strange, but good to handle.
      // It means the poll was created but is not selectable, pointing to a SELECT RLS issue.
      throw new Error(
        "Poll created but could not be fetched. Check SELECT RLS policies.",
      );
    }

    return newPoll;
  }

  async getPoll(id: string): Promise<PollWithOptions | null> {
    const supabase = createClient();
    const { data: poll, error } = await supabase
      .from("polls")
      .select(
        `
        *,
        options: poll_options(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return poll;
  }

  async getPolls(limit = 10, offset = 0): Promise<PollWithOptions[]> {
    const supabase = createClient();
    const { data: polls, error } = await supabase
      .from("polls")
      .select(
        `
        *,
        options: poll_options(*)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return polls || [];
  }

  async getUserPolls(userId: string): Promise<PollWithOptions[]> {
    const supabase = createClient();
    const { data: polls, error } = await supabase
      .from("polls")
      .select(
        `
        *,
        options: poll_options(*)
      `,
      )
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return polls || [];
  }

  async updatePoll(
    id: string,
    data: UpdatePollRequest,
    userId: string,
  ): Promise<Poll> {
    const supabase = createClient();
    const { data: poll, error } = await supabase
      .from("polls")
      .update(data)
      .eq("id", id)
      .eq("created_by", userId)
      .select()
      .single();

    if (error) throw error;
    return poll;
  }

  async deletePoll(id: string, userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("polls")
      .delete()
      .eq("id", id)
      .eq("created_by", userId);

    if (error) throw error;
  }

  // Vote operations
  async vote(data: VoteRequest, userId: string): Promise<Vote> {
    const supabase = createClient();
    // Check if user has already voted on this poll
    const { data: existingVote } = await supabase
      .from("votes")
      .select()
      .eq("poll_id", data.poll_id)
      .eq("user_id", userId)
      .single();

    if (existingVote) {
      throw new Error("User has already voted on this poll");
    }

    const { data: vote, error } = await supabase
      .from("votes")
      .insert({
        poll_id: data.poll_id,
        option_id: data.option_id,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return vote;
  }

  async getPollResults(pollId: string): Promise<PollResult[]> {
    const supabase = createClient();
    const { data: results, error } = await supabase.rpc("get_poll_results", {
      poll_uuid: pollId,
    });

    if (error) throw error;
    return results || [];
  }

  async hasUserVoted(pollId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: hasVoted, error } = await supabase.rpc("has_user_voted", {
      poll_uuid: pollId,
      user_uuid: userId,
    });

    if (error) throw error;
    return hasVoted;
  }
}

// Client-side database operations (for use in components)
export class ClientDatabaseService {
  private supabase = createBrowserClient();

  async vote(data: VoteRequest): Promise<Vote> {
    const { data: vote, error } = await this.supabase
      .from("votes")
      .insert({
        poll_id: data.poll_id,
        option_id: data.option_id,
        user_id: (await this.supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return vote;
  }

  async getPollResults(pollId: string): Promise<PollResult[]> {
    const { data: results, error } = await this.supabase.rpc(
      "get_poll_results",
      { poll_uuid: pollId },
    );

    if (error) throw error;
    return results || [];
  }

  async hasUserVoted(pollId: string): Promise<boolean> {
    const user = (await this.supabase.auth.getUser()).data.user;
    if (!user) return false;

    const { data: hasVoted, error } = await this.supabase.rpc(
      "has_user_voted",
      {
        poll_uuid: pollId,
        user_uuid: user.id,
      },
    );

    if (error) throw error;
    return hasVoted;
  }
}

// Export singleton instances
export const db = new DatabaseService();
export const clientDb = new ClientDatabaseService();
