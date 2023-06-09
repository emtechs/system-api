import { z } from 'zod';
import { YearCreateSchema } from '../schemas';

export type IYearRequest = z.infer<typeof YearCreateSchema>;
