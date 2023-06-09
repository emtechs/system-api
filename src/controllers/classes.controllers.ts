import { Request, Response } from 'express';
import {
  createClassService,
  createClassStudentService,
  exportClassService,
  importClassService,
  listClassService,
  updateClassSchoolService,
  updateClassStudentService,
  createClassSchoolService,
  listClassStudentService,
  dashClassService,
  listClassDashService,
  retrieveClassService,
  listClassYearService,
  retrieveClassYearService,
} from '../services';

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body);
  return res.status(201).json(classData);
};

export const createClassSchoolController = async (
  req: Request,
  res: Response,
) => {
  const classSchool = await createClassSchoolService(
    req.body,
    req.params.year_id,
    req.params.school_id,
  );
  return res.status(201).json(classSchool);
};

export const createClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classStudent = await createClassStudentService(req.body, req.params.id);
  return res.status(201).json(classStudent);
};

export const dashClassController = async (req: Request, res: Response) => {
  const dash = await dashClassService(
    req.params.class_id,
    req.params.school_id,
    req.params.year_id,
    req.query,
  );
  return res.json(dash);
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

export const listClassDashController = async (req: Request, res: Response) => {
  const classes = await listClassDashService(
    req.params.school_id,
    req.params.year_id,
    req.query,
  );
  return res.json(classes);
};

export const listClassYearController = async (req: Request, res: Response) => {
  const classes = await listClassYearService(req.params.year_id, req.query);
  return res.json(classes);
};

export const listClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classes = await listClassStudentService(req.params.year_id, req.query);
  return res.json(classes);
};

export const retrieveClassController = async (req: Request, res: Response) => {
  const classes = await retrieveClassService(req.params.class_id);
  return res.json(classes);
};

export const retrieveClassYearController = async (
  req: Request,
  res: Response,
) => {
  const classes = await retrieveClassYearService(
    req.params.class_id,
    req.params.school_id,
    req.params.year_id,
  );
  return res.json(classes);
};

export const updateClassSchoolController = async (
  req: Request,
  res: Response,
) => {
  const classSchool = await updateClassSchoolService(req.body);
  return res.json(classSchool);
};

export const updateClassStudentController = async (
  req: Request,
  res: Response,
) => {
  const classStudent = await updateClassStudentService(req.body, req.params.id);
  return res.json(classStudent);
};
