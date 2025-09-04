import { z } from 'zod';

export const createPollSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  options: z.array(
    z.string()
      .min(1, 'Option text is required')
      .max(200, 'Option must be less than 200 characters')
      .trim()
  )
    .min(2, 'At least 2 options are required')
    .max(10, 'Maximum 10 options allowed'),
});

export const updatePollSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  category: z.string()
    .max(50, 'Category must be less than 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().optional(),
  is_public: z.boolean().optional(),
  allow_multiple_votes: z.boolean().optional(),
  expires_at: z.string()
    .datetime('Invalid date format')
    .optional()
    .or(z.literal('')),
});

export const voteSchema = z.object({
  poll_id: z.string().uuid('Invalid poll ID'),
  option_id: z.string().uuid('Invalid option ID'),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;
export type VoteInput = z.infer<typeof voteSchema>;