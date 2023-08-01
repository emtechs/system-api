import { z } from 'zod'
import {
  SchoolClassCreateSchema,
  SchoolCreateSchema,
  SchoolReportSchema,
  SchoolReturnSchema,
  SchoolServerCreateSchema,
  SchoolServerReturnSchema,
  SchoolUpdateSchema,
} from '../schemas'
import { IQuery } from './global.interfaces'
import { CategoryPeriod } from '@prisma/client'

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>

export type ISchoolReportRequest = z.infer<typeof SchoolReportSchema>

export type ISchoolData = z.infer<typeof SchoolReturnSchema>

export type ISchoolServerData = z.infer<typeof SchoolServerReturnSchema>

export type ISchoolServerRequest = z.infer<typeof SchoolServerCreateSchema>

export type ISchoolClassRequest = z.infer<typeof SchoolClassCreateSchema>

export type ISchoolUpdateRequest = z.infer<typeof SchoolUpdateSchema>

export interface ISchool {
  name: string
  director_id: string
}

export interface ISchoolUpdate {
  id?: string
}

export interface ISchoolUpdateInfrequency {
  school_id: string
  periods: { period_id: string }[]
}

export interface ISchoolQuery extends IQuery {
  is_director?: 'true' | 'false'
  infreq?: number
  name?: string
  director_id?: string
  server_id?: string
  none_server_id?: string
  category?: CategoryPeriod
  view?: 'server' | 'class' | 'student'
}
