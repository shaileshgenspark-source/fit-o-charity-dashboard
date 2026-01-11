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

export const determineGroupCode = (code: string): string | null => {
  const codeNum = parseInt(code);
  if (!isNaN(codeNum)) {
    if (codeNum >= 1000 && codeNum < 2000) return '1000';
    if (codeNum >= 2000 && codeNum < 3000) return '2000';
    if (codeNum >= 3000 && codeNum < 4000) return '3000';
    if (codeNum >= 4000 && codeNum < 5000) return '4000';
    if (codeNum >= 5000 && codeNum < 6000) return '5000';
  }
  return null;
};
