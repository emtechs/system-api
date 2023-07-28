import { Request, Response } from 'express'
import {
  listClassYearInfrequencyService,
  listInfrequencyService,
  reportClassService,
  updateInfrequencyService,
} from '../services'

export const listClassYearInfrequencyController = async (
  req: Request,
  res: Response,
) => {
  const infrequencies = await listClassYearInfrequencyService(req.query)
  return res.json(infrequencies)
}

export const listInfrequencyController = async (
  req: Request,
  res: Response,
) => {
  const infrequencies = await listInfrequencyService(req.query)
  return res.json(infrequencies)
}

export const reportClassController = async (req: Request, res: Response) => {
  const report = await reportClassService(req.body)
  return res.json(report)
}

export const updateInfrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateInfrequencyService(req.body, req.params.id)
  return res.json(frequency)
}
