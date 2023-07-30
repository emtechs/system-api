import { Request, Response } from 'express'
import {
  createSchoolClassService,
  createSchoolServerService,
  createSchoolService,
  dashSchoolService,
  deleteDirectorSchoolService,
  deleteSchoolServerService,
  deleteSchoolService,
  exportSchoolService,
  importSchoolService,
  listSchoolServerService,
  listSchoolService,
  retrieveSchoolService,
  updateSchoolService,
} from '../services'

export const createSchoolController = async (req: Request, res: Response) => {
  const school = await createSchoolService(req.body)
  return res.status(201).json(school)
}

export const createSchoolClassController = async (
  req: Request,
  res: Response,
) => {
  const school = await createSchoolClassService(
    req.body,
    req.params.school_id,
    req.params.year_id,
  )
  return res.status(201).json(school)
}

export const createSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  const school = await createSchoolServerService(req.body, req.params.server_id)
  return res.status(201).json(school)
}

export const dashSchoolController = async (req: Request, res: Response) => {
  const dash = await dashSchoolService(
    req.params.school_id,
    req.params.year_id,
    req.query,
  )
  return res.json(dash)
}

export const importSchoolController = async (req: Request, res: Response) => {
  const schools = await importSchoolService(req.file)
  return res.status(201).json(schools)
}

export const exportSchoolController = async (req: Request, res: Response) => {
  const schools = await exportSchoolService()
  return res.json(schools)
}

export const listSchoolController = async (req: Request, res: Response) => {
  const schools = await listSchoolService(req.query)
  return res.json(schools)
}

export const listSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  const schools = await listSchoolServerService(req.query)
  return res.json(schools)
}

export const retrieveSchoolController = async (req: Request, res: Response) => {
  const school = await retrieveSchoolService(req.params.school_id, req.query)
  return res.json(school)
}

export const updateSchoolController = async (req: Request, res: Response) => {
  const school = await updateSchoolService(
    req.body,
    req.params.school_id,
    req.query,
  )
  return res.json(school)
}

export const deleteDirectorSchoolController = async (
  req: Request,
  res: Response,
) => {
  await deleteDirectorSchoolService(req.params.school_id)
  return res.status(204).json({})
}

export const deleteSchoolController = async (req: Request, res: Response) => {
  await deleteSchoolService(req.params.school_id)
  return res.status(204).json({})
}

export const deleteSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  await deleteSchoolServerService(req.params.school_id, req.params.server_id)
  return res.status(204).json({})
}
