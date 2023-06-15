import { Request, Response } from 'express';
import {
  createYearService,
  exportYearService,
  listCalendarFrequencyService,
  listCalendarService,
  listYearService,
  retrieveYearService,
} from '../services';

export const createYearController = async (req: Request, res: Response) => {
  const year = await createYearService(req.body);
  return res.status(201).json(year);
};

export const listCalendarController = async (req: Request, res: Response) => {
  const calendar = await listCalendarService(req.params.year_id, req.query);
  return res.json(calendar);
};

export const listCalendarFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const calendar = await listCalendarFrequencyService(
    req.params.year_id,
    req.params.school_id,
    req.params.class_id,
    req.query,
  );
  return res.json(calendar);
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
