import { Request, Response } from 'express';
import {
  createSchoolService,
  dashSchoolServerService,
  deleteDirectorSchoolService,
  deleteSchoolServerService,
  deleteSchoolService,
  exportSchoolService,
  importSchoolService,
  listSchoolServerService,
  listSchoolService,
  retrieveSchoolService,
  updateSchoolService,
} from '../services';

export const createSchoolController = async (req: Request, res: Response) => {
  const school = await createSchoolService(req.body);
  return res.status(201).json(school);
};

export const dashSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  const dash = await dashSchoolServerService(req.params.id, req.query);
  return res.json(dash);
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

export const listSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  const servers = await listSchoolServerService(req.params.id, req.query);
  return res.json(servers);
};

export const retrieveSchoolController = async (req: Request, res: Response) => {
  const school = await retrieveSchoolService(req.params.id, req.query);
  return res.json(school);
};

export const updateSchoolController = async (req: Request, res: Response) => {
  const school = await updateSchoolService(req.body, req.params.id);
  return res.json(school);
};

export const deleteDirectorSchoolController = async (
  req: Request,
  res: Response,
) => {
  await deleteDirectorSchoolService(req.params.id);
  return res.status(204).json({});
};

export const deleteSchoolController = async (req: Request, res: Response) => {
  await deleteSchoolService(req.params.id);
  return res.status(204).json({});
};

export const deleteSchoolServerController = async (
  req: Request,
  res: Response,
) => {
  await deleteSchoolServerService(req.params.school_id, req.params.server_id);
  return res.status(204).json({});
};
