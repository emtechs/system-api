import { Request, Response } from 'express';
import {
  createYearService,
  exportYearService,
  listYearService,
  retrieveYearService,
} from '../services';

export const createYearController = async (req: Request, res: Response) => {
  const year = await createYearService(req.body);
  return res.status(201).json(year);
};

export const listYearController = async (req: Request, res: Response) => {
  const years = await listYearService();
  return res.json(years);
};

export const retrieveYearController = async (req: Request, res: Response) => {
  const year = await retrieveYearService(req.params.year);
  return res.json(year);
};

export const exportYearController = async (req: Request, res: Response) => {
  const years = await exportYearService();
  return res.json(years);
};
