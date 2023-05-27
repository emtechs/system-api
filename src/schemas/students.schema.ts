import { z } from 'zod';

export const StudentCreateSchema = z.object({
  name: z.string(),
  registry: z.string(),
});

export const StudentCreateWithClassSchema = z.object({
  name: z.string(),
  registry: z.string(),
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
});
