import { Request, Response } from 'express';
import {
  createSchoolService,
  createSchoolYearService,
  exportSchoolService,
  exportSchoolYearService,
  importSchoolService,
  listSchoolService,
  listSchoolYearService,
  retrieveSchoolYearService,
  updateSchoolService,
} from '../services';

export const createSchoolController = async (req: Request, res: Response) => {
  const school = await createSchoolService(req.body);
  return res.status(201).json(school);
};

export const importSchoolController = async (req: Request, res: Response) => {
  const schools = await importSchoolService(req.file);
  return res.status(201).json(schools);
};

export const exportSchoolController = async (req: Request, res: Response) => {
  const schools = await exportSchoolService();
  return res.json(schools);
};

export const listSchoolController = async (req: Request, res: Response) => {
  const schools = await listSchoolService(req.query);
  return res.json(schools);
};

export const createSchoolYearController = async (
  req: Request,
  res: Response,
) => {
  const schoolYear = await createSchoolYearService(req.body);
  return res.status(201).json(schoolYear);
};

export const listSchoolYearController = async (req: Request, res: Response) => {
  const schoolYears = await listSchoolYearService();
  return res.json(schoolYears);
};

export const retrieveSchoolYearController = async (
  req: Request,
  res: Response,
) => {
  const schoolYear = await retrieveSchoolYearService(req.params.year);
  return res.json(schoolYear);
};

export const exportSchoolYearController = async (
  req: Request,
  res: Response,
) => {
  const schoolYears = await exportSchoolYearService();
  return res.json(schoolYears);
};

export const updateSchoolController = async (req: Request, res: Response) => {
  const school = await updateSchoolService(req.body, req.params.id);
  return res.json(school);
};
