import { Request, Response } from 'express';
import {
  updatePasswordService,
  sendEmailRecoveryService,
  createSessionService,
} from '../services';

export const createSessionController = async (req: Request, res: Response) => {
  const token = await createSessionService(req.body);

  return res.status(201).json(token);
};

export const updatePasswordController = async (req: Request, res: Response) => {
  const user = await updatePasswordService(
    req.body,
    req.params.userId,
    req.params.token,
  );

  return res.status(200).json(user);
};

export const sendEmailToRecovery = async (req: Request, res: Response) => {
  const user = await sendEmailRecoveryService(req.body);

  return res.status(200).json(user);
};
