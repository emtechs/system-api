import { z } from 'zod'
import {
  StudentCreateSchema,
  StudentCreateWithClassSchema,
  StudentUpdateSchema,
} from '../schemas'
import { IQuery } from './global.interfaces'

export interface IStudent {
  registry: string
  name: string
  school_id: string
  class_id: string
  year_id: string
}

export interface IStudentData {
  id: string
  name: string
  registry: string
  created_at: Date
}

export type IStudentRequest = z.infer<typeof StudentCreateSchema>

export type IStudentUpdateRequest = z.infer<typeof StudentUpdateSchema>

export interface IStudentUpdate {
  value: number
  presences: number
  justified: number
  absences: number
  frequencies: number
  id: string
}

export interface IStudentUpdateMany {
  students: IStudentUpdate[]
}

export interface IStudentUpdateInfrequency {
  students: { student_id: string }[]
  periods: { period_id: string }[]
}

export type IStudentWithClassRequest = z.infer<
  typeof StudentCreateWithClassSchema
>

export interface IStudentQuery extends IQuery {
  is_active?: 'true' | 'false'
  is_list?: string
  infreq?: number
}
