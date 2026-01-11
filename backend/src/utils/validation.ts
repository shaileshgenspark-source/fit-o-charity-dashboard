import { z } from 'zod';

export const activitySchema = z.object({
  code: z.string().min(1, { message: 'Code is required' }).transform(val => val.toUpperCase()),
  activityType: z.enum(['Walking', 'Running', 'Cycling', 'Yoga', 'Gym', 'Other']),
  distance: z.number().min(0).optional().default(0),
  duration: z.number().min(0).optional().default(0),
  groupCode: z.string().toUpperCase().optional().nullable()
});

export const validateActivity = (data: unknown) => {
  return activitySchema.safeParse(data);
};
