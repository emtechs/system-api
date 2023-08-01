import { Request, Response } from 'express'
import {
  createClassService,
  createClassStudentService,
  exportClassService,
  importClassService,
  listClassService,
  createClassSchoolService,
  dashClassService,
  listClassDashService,
  retrieveClassService,
  listClassYearService,
  retrieveClassYearService,
  deleteClassStudentService,
  transferClassStudentService,
} from '../services'

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body)
  return res.status(201).json(classData)
}

export const createClassSchoolController = async (
  req: Request,
  res: Response,
) => {
  const classSchool = await createClassSchoolService(req.body)
  return res.status(201).json(classSchool)
}

export const createClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classStudent = await createClassStudentService(req.body)
  return res.status(201).json(classStudent)
}

export const dashClassController = async (req: Request, res: Response) => {
  const dash = await dashClassService(
    req.params.class_id,
    req.params.school_id,
    req.params.year_id,
    req.query,
  )
  return res.json(dash)
}

export const deleteClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classData = await deleteClassStudentService(req.params.key)
  return res.json(classData)
}

export const importClassController = async (req: Request, res: Response) => {
  const classes = await importClassService(req.file)
  return res.status(201).json(classes)
}

export const exportClassController = async (req: Request, res: Response) => {
  const classes = await exportClassService()
  return res.json(classes)
}

export const listClassController = async (req: Request, res: Response) => {
  const classes = await listClassService(req.query)
  return res.json(classes)
}

export const listClassDashController = async (req: Request, res: Response) => {
  const classes = await listClassDashService(
    req.params.school_id,
    req.params.year_id,
    req.query,
  )
  return res.json(classes)
}

export const listClassYearController = async (req: Request, res: Response) => {
  const classes = await listClassYearService(req.query)
  return res.json(classes)
}

export const retrieveClassController = async (req: Request, res: Response) => {
  const classes = await retrieveClassService(req.params.class_id)
  return res.json(classes)
}

export const retrieveClassYearController = async (
  req: Request,
  res: Response,
) => {
  const classes = await retrieveClassYearService(req.params.key)
  return res.json(classes)
}

export const transferClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classes = await transferClassStudentService(req.body)
  return res.json(classes)
}
