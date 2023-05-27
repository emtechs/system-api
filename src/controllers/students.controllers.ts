import { Request, Response } from 'express';
import {
  createStudentService,
  createStudentWithClassService,
  importStudentAllService,
  importStudentService,
  listStudentService,
  retrieveStudentService,
} from '../services';

export const createStudentController = async (req: Request, res: Response) => {
  const student = await createStudentService(req.body);
  return res.status(201).json(student);
};

export const createStudentWithClassController = async (
  req: Request,
  res: Response,
) => {
  const student = await createStudentWithClassService(req.body, req.params.id);
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

export const importStudentAllController = async (
  req: Request,
  res: Response,
) => {
  const students = await importStudentAllService(req.file);
  return res.status(201).json(students);
};

export const listStudentController = async (req: Request, res: Response) => {
  const students = await listStudentService(req.query);
  return res.json(students);
};

export const retrieveStudentController = async (
  req: Request,
  res: Response,
) => {
  const student = await retrieveStudentService(req.params.id);
  return res.json(student);
};
