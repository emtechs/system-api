import { Request, Response } from 'express';
import {
  createClassService,
  createFrequencyService,
  createFrequencyStudentService,
  createSchoolService,
  createStudentService,
  importClassService,
  importSchoolService,
  importStudentService,
  listClassService,
  listFrequencyService,
  listFrequencyStudentService,
  listSchoolService,
  listStudentService,
  retrieveFrequencyService,
  retrieveStudentService,
  updateFrequencyService,
  updateFrequencyStudentService,
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

export const listSchoolController = async (req: Request, res: Response) => {
  const schools = await listSchoolService(req.query);
  return res.json(schools);
};

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body, req.params.id);
  return res.status(201).json(classData);
};

export const importClassController = async (req: Request, res: Response) => {
  const classes = await importClassService(req.file, req.params.id);
  return res.status(201).json(classes);
};

export const listClassController = async (req: Request, res: Response) => {
  const classes = await listClassService(req.query);
  return res.json(classes);
};

export const createStudentController = async (req: Request, res: Response) => {
  const student = await createStudentService(req.body, req.params.id);
  return res.status(201).json(student);
};

export const importStudentController = async (req: Request, res: Response) => {
  const students = await importStudentService(
    req.file,
    req.params.class_id,
    req.params.school_id,
  );
  return res.status(201).json(students);
};

export const listStudentController = async (req: Request, res: Response) => {
  const students = await listStudentService();
  return res.json(students);
};

export const retrieveStudentController = async (
  req: Request,
  res: Response,
) => {
  const student = await retrieveStudentService(req.params.id);
  return res.json(student);
};

export const createFrequencyController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyService(req.body, req.user.id);
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
