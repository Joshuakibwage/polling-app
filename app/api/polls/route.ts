import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/database";
import { createPollSchema } from "@/lib/validations/poll";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    console.log("Request body:", body);

    const validatedData = createPollSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Create the poll
    const poll = await db.createPoll(validatedData, user.id);
    console.log("Created poll:", poll);

    return NextResponse.json(
      {
        success: true,
        poll,
        message: "Poll created successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating poll:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    // Return more detailed error information
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to create poll",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const polls = await db.getPolls(limit, offset);

    return NextResponse.json(
      {
        success: true,
        polls,
        pagination: {
          limit,
          offset,
          hasMore: polls.length === limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching polls:", error);

    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 },
    );
  }
}
