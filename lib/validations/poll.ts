import { z } from "zod"

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  options: z.array(z.string().min(1, "Option text is required")).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
  isPublic: z.boolean().default(true),
  allowMultipleVotes: z.boolean().default(false),
  endDate: z.string().optional(),
})

export const voteSchema = z.object({
  pollId: z.string().min(1, "Poll ID is required"),
  optionIds: z.array(z.string().min(1, "Option ID is required")).min(1, "At least one option must be selected"),
})

export type CreatePollInput = z.infer<typeof createPollSchema>
export type VoteInput = z.infer<typeof voteSchema>
