import { Request, Response } from 'express'
import {
  createPeriodService,
  createYearService,
  exportYearService,
  importMonthService,
  listCalendarFrequencyService,
  listCalendarService,
  listCalendarStudentService,
  listPeriodService,
  listYearService,
  retrieveYearService,
  updatePeriodService,
} from '../services'

export const createPeriodController = async (req: Request, res: Response) => {
  const period = await createPeriodService(req.body, req.params.year_id)
  return res.status(201).json(period)
}

export const createYearController = async (req: Request, res: Response) => {
  const year = await createYearService(req.body)
  return res.status(201).json(year)
}

export const exportYearController = async (req: Request, res: Response) => {
  const years = await exportYearService()
  return res.json(years)
}

export const importMonthController = async (req: Request, res: Response) => {
  const months = await importMonthService(req.file)
  return res.status(201).json(months)
}

export const listCalendarController = async (req: Request, res: Response) => {
  const calendar = await listCalendarService(req.params.year_id, req.query)
  return res.json(calendar)
}

export const listCalendarFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const calendar = await listCalendarFrequencyService(
    req.params.year_id,
    req.params.school_id,
    req.params.class_id,
    req.query,
  )
  return res.json(calendar)
}

export const listCalendarStudentController = async (
  req: Request,
  res: Response,
) => {
  const calendar = await listCalendarStudentService(
    req.params.student_id,
    req.query,
  )
  return res.json(calendar)
}

export const listPeriodController = async (req: Request, res: Response) => {
  const periods = await listPeriodService(req.query)
  return res.json(periods)
}

export const listYearController = async (req: Request, res: Response) => {
  const years = await listYearService()
  return res.json(years)
}

export const retrieveYearController = async (req: Request, res: Response) => {
  const year = await retrieveYearService(req.params.year)
  return res.json(year)
}

export const updatePeriodController = async (req: Request, res: Response) => {
  const period = await updatePeriodService(req.body, req.params.period_id)
  return res.json(period)
}
