import { Request, Response } from 'express';
import {
  createMonthService,
  createYearService,
  exportYearService,
  listMonthService,
  listYearService,
  retrieveYearService,
} from '../services';

export const createYearController = async (req: Request, res: Response) => {
  const year = await createYearService(req.body);
  return res.status(201).json(year);
};

export const createMonthController = async (req: Request, res: Response) => {
  const month = await createMonthService(req.body);
  return res.status(201).json(month);
};

export const listYearController = async (req: Request, res: Response) => {
  const years = await listYearService();
  return res.json(years);
};

export const listMonthController = async (req: Request, res: Response) => {
  const months = await listMonthService();
  return res.json(months);
};

export const retrieveYearController = async (req: Request, res: Response) => {
  const year = await retrieveYearService(req.params.year);
  return res.json(year);
};

export const exportYearController = async (req: Request, res: Response) => {
  const years = await exportYearService();
  return res.json(years);
};
