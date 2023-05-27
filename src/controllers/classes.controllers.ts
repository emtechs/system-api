import { Request, Response } from 'express';
import {
  createClassService,
  createClassStudentService,
  exportClassService,
  importClassService,
  listClassService,
  listClassWithSchoolService,
} from '../services';

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body);
  return res.status(201).json(classData);
};

export const createClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classStudent = await createClassStudentService(req.body, req.params.id);
  return res.status(201).json(classStudent);
};

export const importClassController = async (req: Request, res: Response) => {
  const classes = await importClassService(req.file);
  return res.status(201).json(classes);
};

export const exportClassController = async (req: Request, res: Response) => {
  const classes = await exportClassService();
  return res.json(classes);
};

export const listClassController = async (req: Request, res: Response) => {
  const classes = await listClassService(req.query);
  return res.json(classes);
};

export const listClassWithSchoolController = async (
  req: Request,
  res: Response,
) => {
  const classes = await listClassWithSchoolService(req.params.id, req.query);
  return res.json(classes);
};
