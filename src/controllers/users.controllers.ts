import { Request, Response } from 'express'
import {
  createUserService,
  listUserService,
  retrieveUserService,
  updateUserService,
  deleteUserService,
  retrieveUserWithCpfService,
  exportUserService,
  importUserService,
  dashUserService,
  listWorkSchoolService,
  profileUserService,
  pageUserService,
} from '../services'

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUserService(req.body, req.query)
  return res.status(201).json(user)
}

export const listUserController = async (req: Request, res: Response) => {
  const users = await listUserService(req.query, req.user.id)
  return res.json(users)
}

export const listWorkSchoolController = async (req: Request, res: Response) => {
  const servers = await listWorkSchoolService(req.user, req.query)
  return res.json(servers)
}

export const pageUserController = async (req: Request, res: Response) => {
  const user = await pageUserService(req.user.id, req.query)
  return res.json(user)
}

export const retrieveUserController = async (req: Request, res: Response) => {
  const user = await retrieveUserService(req.params.id, req.query)
  return res.json(user)
}

export const retrieveUserWithCpfController = async (
  req: Request,
  res: Response,
) => {
  const user = await retrieveUserWithCpfService(req.params.cpf, req.query)
  return res.json(user)
}

export const profileUserController = async (req: Request, res: Response) => {
  const user = await profileUserService(req.user)
  return res.json(user)
}

export const importUserController = async (req: Request, res: Response) => {
  const users = await importUserService(req.file)
  return res.status(201).json(users)
}

export const exportUserController = async (req: Request, res: Response) => {
  const users = await exportUserService()
  return res.json(users)
}

export const dashUserController = async (req: Request, res: Response) => {
  const user = await dashUserService(req.params.year_id)
  return res.json(user)
}

export const updateUserController = async (req: Request, res: Response) => {
  const user = await updateUserService(req.params.id, req.body, req.user.role)
  return res.json(user)
}

export const deleteUserController = async (req: Request, res: Response) => {
  await deleteUserService(req.params.id)
  return res.status(204).json({})
}
