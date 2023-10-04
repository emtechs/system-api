import { Request, Response } from 'express'
import {
  createFrequencyService,
  createFrequencyStudentService,
  createRequestService,
  deleteFrequencyService,
  deleteRequestService,
  listFrequencyErrorService,
  listFrequencyService,
  listFrequencyStudentService,
  listRequestService,
  resumeFrequencySchoolService,
  resumeFrequencyService,
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

export const createRequestController = async (req: Request, res: Response) => {
  const reqst = await createRequestService(req.body, req.user.id)
  return res.status(201).json(reqst)
}

export const listFrequencyController = async (req: Request, res: Response) => {
  const frequencies = await listFrequencyService(req.query)
  return res.json(frequencies)
}

export const listFrequencyErrorController = async (
  req: Request,
  res: Response,
) => {
  const frequencies = await listFrequencyErrorService()
  return res.json(frequencies)
}

export const listRequestController = async (req: Request, res: Response) => {
  const reqst = await listRequestService()
  return res.json(reqst)
}

export const updateFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyService(req.body, req.params.id)
  return res.json(frequency)
}

export const resumeFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await resumeFrequencyService(req.params.year_id, req.query)
  return res.json(frequency)
}

export const resumeFrequencySchoolController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await resumeFrequencySchoolService(
    req.params.year_id,
    req.params.school_id,
    req.query,
  )
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

export const deleteRequestController = async (req: Request, res: Response) => {
  const reqst = await deleteRequestService(req.body)
  return res.json(reqst)
}

export const deleteFrequencyController = async (
  req: Request,
  res: Response,
) => {
  await deleteFrequencyService(req.params.id)
  return res.status(204).json({})
}
