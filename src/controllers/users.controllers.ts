import { Request, Response } from 'express';
import {
  createUserService,
  listUserService,
  retrieveUserService,
  updateUserService,
  deleteUserService,
  retrieveUserWithCpfService,
} from '../services';

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUserService(req.body);
  return res.status(201).json(user);
};

export const listUserController = async (req: Request, res: Response) => {
  const users = await listUserService(req.query);
  return res.json(users);
};

export const retrieveUserController = async (req: Request, res: Response) => {
  const user = await retrieveUserService(req.params.id);
  return res.json(user);
};

export const retrieveUserWithCpfController = async (
  req: Request,
  res: Response,
) => {
  const user = await retrieveUserWithCpfService(req.params.cpf);
  return res.json(user);
};

export const profileUserController = async (req: Request, res: Response) => {
  const user = await retrieveUserService(req.user.id);
  return res.json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const user = await updateUserService(req.params.id, req.body, req.user.role);
  return res.json(user);
};

export const deleteUserController = async (req: Request, res: Response) => {
  await deleteUserService(req.params.id);
  return res.status(204).json({});
};
