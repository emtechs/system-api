import { Request, Response } from 'express'
import {
  infrequencySchoolService,
  reportClassService,
  reportSchoolService,
  reportStudentService,
} from '../services'

export const infrequencySchoolController = async (
  req: Request,
  res: Response,
) => {
  const report = await infrequencySchoolService(
    req.params.school_id,
    req.params.year_id,
    req.query,
  )
  return res.json(report)
}

export const reportClassController = async (req: Request, res: Response) => {
  const report = await reportClassService(req.body)
  return res.json(report)
}

export const reportSchoolController = async (req: Request, res: Response) => {
  const report = await reportSchoolService(req.body)
  return res.json(report)
}

export const reportStudentController = async (req: Request, res: Response) => {
  const report = await reportStudentService(req.body)
  return res.json(report)
}
