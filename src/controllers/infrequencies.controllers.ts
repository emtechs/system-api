import { Request, Response } from 'express'
import {
  reportClassService,
  reportSchoolService,
  reportStudentService,
} from '../services'

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
