import { z } from 'zod'
import {
  ClassCreateSchema,
  ClassReportSchema,
  ClassSchoolCreateSchema,
  ClassStudentCreateSchema,
  ClassStudentUpdateSchema,
  DeleteClassStudentSchema,
  TransferClassStudentSchema,
} from '../schemas'
import { IQuery } from './global.interfaces'

export interface IClass {
  name: string
}

export interface IClassStudent {
  class_id: string
  school_id: string
  year_id: string
  student_id: string
}

export type IClassRequest = z.infer<typeof ClassCreateSchema>

export interface IClassSchoolUpdateRequest {
  class_id: string
  school_id: string
  year_id: string
  school_frequencies: number
  school_infreq: number
  class_infreq: number
}

export interface IClassUpdateInfrequency {
  class_id: string
  school_id: string
  year_id: string
  periods: { period_id: string }[]
}

export type IClassSchoolRequest = z.infer<typeof ClassSchoolCreateSchema>

export type IClassStudentRequest = z.infer<typeof ClassStudentCreateSchema>

export type IClassStudentUpdate = z.infer<typeof ClassStudentUpdateSchema>

export type IDeleteClassStudentRequest = z.infer<
  typeof DeleteClassStudentSchema
>

export type ITransferClassStudentRequest = z.infer<
  typeof TransferClassStudentSchema
>

export type IClassReportRequest = z.infer<typeof ClassReportSchema>

export interface IClassQuery extends IQuery {
  infreq?: number
  is_infreq?: string
  name?: string
  is_school?: string
  view?: 'studen'
  is_report?: string
}
