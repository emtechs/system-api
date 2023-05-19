import { Request, Response } from 'express';
import {
  createClassService,
  createFrequencyService,
  createFrequencyStudentService,
  createSchoolService,
  createStudentService,
  listClassService,
  listFrequencyService,
  listFrequencyStudentService,
  listSchoolService,
  listStudentService,
  retrieveFrequencyService,
  updateFrequencyService,
  updateFrequencyStudentService,
  updateSchoolService,
} from '../services';

export const createSchoolController = async (req: Request, res: Response) => {
  const school = await createSchoolService(req.body);
  return res.status(201).json(school);
};

export const listSchoolController = async (req: Request, res: Response) => {
  const schools = await listSchoolService();
  return res.json(schools);
};

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body, req.params.id);
  return res.status(201).json(classData);
};

export const listClassController = async (req: Request, res: Response) => {
  const classes = await listClassService(req.query);
  return res.json(classes);
};

export const createStudentController = async (req: Request, res: Response) => {
  const student = await createStudentService(req.body, req.params.id);
  return res.status(201).json(student);
};

export const listStudentController = async (req: Request, res: Response) => {
  const students = await listStudentService();
  return res.json(students);
};

export const createFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyService(req.body, req.params.id);
  return res.status(201).json(frequency);
};

export const listFrequencyController = async (req: Request, res: Response) => {
  const frequencies = await listFrequencyService(req.query);
  return res.json(frequencies);
};

export const updateFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyService(req.body, req.params.id);
  return res.json(frequency);
};

export const retrieveFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await retrieveFrequencyService(req.params.id);
  return res.json(frequency);
};

export const createFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyStudentService(req.body);
  return res.status(201).json(frequency);
};

export const listFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequencies = await listFrequencyStudentService();
  return res.json(frequencies);
};

export const updateFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await updateFrequencyStudentService(
    req.body,
    req.params.id,
  );
  return res.json(frequency);
};

export const updateSchoolController = async (req: Request, res: Response) => {
  const school = await updateSchoolService(req.body, req.params.id);
  return res.json(school);
};
