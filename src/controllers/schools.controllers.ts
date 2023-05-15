import { Request, Response } from 'express';
import {
  createClassService,
  createFrequencyService,
  createFrequencyStudentService,
  createSchoolService,
  createServerService,
  createStudentService,
  listClassService,
  listSchoolService,
  listStudentService,
  retrieveServerWithCpfService,
} from '../services';

export const createSchoolController = async (req: Request, res: Response) => {
  const school = await createSchoolService(req.body);
  return res.status(201).json(school);
};

export const listSchoolController = async (req: Request, res: Response) => {
  const schools = await listSchoolService();
  return res.json(schools);
};

export const createServerController = async (req: Request, res: Response) => {
  const server = await createServerService(req.body, req.params.id);
  return res.status(201).json(server);
};

export const retrieveServerWithCpfController = async (
  req: Request,
  res: Response,
) => {
  const server = await retrieveServerWithCpfService(
    req.params.id,
    req.params.cpf,
  );
  return res.json(server);
};

export const createClassController = async (req: Request, res: Response) => {
  const classData = await createClassService(req.body, req.params.id);
  return res.status(201).json(classData);
};

export const listClassController = async (req: Request, res: Response) => {
  const classes = await listClassService();
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

export const createFrequencyStudentController = async (
  req: Request,
  res: Response,
) => {
  const frequency = await createFrequencyStudentService(
    req.body,
    req.params.frequency_id,
    req.params.school_id,
  );
  return res.status(201).json(frequency);
};

// export const retrieveUserController = async (req: Request, res: Response) => {
//   const user = await retrieveUserService(req.params.id);
//   return res.json(user);
// };

// export const retrieveUserWithCpfController = async (
//   req: Request,
//   res: Response,
// ) => {
//   const user = await retrieveUserWithCpfService(req.params.cpf);
//   return res.json(user);
// };

// export const profileUserController = async (req: Request, res: Response) => {
//   const user = await retrieveUserService(req.user.id);
//   return res.json(user);
// };

// export const updateUserController = async (req: Request, res: Response) => {
//   const user = await updateUserService(req.params.id, req.body, req.user.role);
//   return res.json(user);
// };

// export const deleteUserController = async (req: Request, res: Response) => {
//   await deleteUserService(req.params.id);
//   return res.status(204).json({});
// };
