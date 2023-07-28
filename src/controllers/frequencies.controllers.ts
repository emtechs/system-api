import { Request, Response } from 'express'
import {
  createFrequencyService,
  createFrequencyStudentService,
  deleteFrequencyService,
  listFrequencyHistoryService,
  listFrequencyService,
  listFrequencyStudentService,
  retrieveFrequencyService,
  updateFrequencyService,
  updateFrequencyStudentService,
} from '../services'

export const createFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyService(req.body, req.user.id)
  return res.status(201).json(frequency)
}

export const listFrequencyController = async (req: Request, res: Response) => {
  const frequencies = await listFrequencyService(req.query)
  return res.json(frequencies)
}

export const listFrequencyHistoryController = async (
  req: Request,
  res: Response,
) => {
  const frequencies = await listFrequencyHistoryService(req.query)
  return res.json(frequencies)
}

export const updateFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyService(req.body, req.params.id)
  return res.json(frequency)
}

export const retrieveFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await retrieveFrequencyService(req.params.id)
  return res.json(frequency)
}

export const createFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyStudentService(req.body)
  return res.status(201).json(frequency)
}

export const listFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequencies = await listFrequencyStudentService(
    req.params.id,
    req.query,
  )
  return res.json(frequencies)
}

export const updateFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyStudentService(req.body, req.params.id)
  return res.json(frequency)
}

export const deleteFrequencyController = async (
  req: Request,
  res: Response,
) => {
  await deleteFrequencyService(req.params.id)
  return res.status(204).json({})
}
