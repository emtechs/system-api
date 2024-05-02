import { Request, Response } from 'express'
import {
  listFrequencyStudentService,
  retrieveFrequencyStudentService,
  updateFrequencyStudentService,
} from '../services'

export const listFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequencies = await listFrequencyStudentService(req.query)
  return res.json(frequencies)
}

export const retrieveFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await retrieveFrequencyStudentService(req.params.id)
  return res.json(frequency)
}

export const updateFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyStudentService(req.body, req.params.id)
  return res.json(frequency)
}
