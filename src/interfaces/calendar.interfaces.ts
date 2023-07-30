import { z } from 'zod'
import { YearCreateSchema } from '../schemas'
import { IQuery } from './global.interfaces'
import { CategoryPeriod } from '@prisma/client'

export type IYearRequest = z.infer<typeof YearCreateSchema>

export interface IMonth {
  name: string
  month: number
}

export interface ICalendarQuery extends IQuery {
  month?: string
  category?: CategoryPeriod
}
