import { z } from 'zod'

export const teamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name cannot exceed 50 characters'),
  playerCount: z
    .number({ message: 'Player count must be a number' })
    .int('Player count must be an integer')
    .min(1, 'Player count must be at least 1')
    .max(50, 'Player count cannot exceed 50'),
  region: z
    .string()
    .trim()
    .min(2, 'Region must be at least 2 characters')
    .max(50, 'Region cannot exceed 50 characters'),
  country: z
    .string()
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country cannot exceed 50 characters'),
})

export type TeamFormData = z.infer<typeof teamSchema>
