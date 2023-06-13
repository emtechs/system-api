import { Request, Response } from 'express';
import {
  createYearService,
  exportYearService,
  listCalendarService,
  listYearService,
  retrieveCalendarSchoolService,
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

export const listYearController = async (req: Request, res: Response) => {
  const years = await listYearService();
  return res.json(years);
};

export const retrieveYearController = async (req: Request, res: Response) => {
  const year = await retrieveYearService(req.params.year);
  return res.json(year);
};

export const retrieveCalendarSchoolController = async (
  req: Request,
  res: Response,
) => {
  const calendar = await retrieveCalendarSchoolService(
    req.params.date,
    req.params.school_id,
  );
  return res.json(calendar);
};

export const exportYearController = async (req: Request, res: Response) => {
  const years = await exportYearService();
  return res.json(years);
};
