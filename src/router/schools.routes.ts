import { Router } from 'express';
import {
  createClassController,
  createFrequencyController,
  createFrequencyStudentController,
  createSchoolController,
  createStudentController,
  importStudentController,
  listClassController,
  listFrequencyController,
  listFrequencyStudentController,
  listReportController,
  listSchoolController,
  listStudentController,
  retrieveFrequencyController,
  retrieveStudentController,
  updateFrequencyController,
  updateFrequencyStudentController,
  updateSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  FrequencyCreateSchema,
  FrequencyStudentCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
  SchoolCreateSchema,
  SchoolUpdateSchema,
  StudentCreateSchema,
} from '../schemas';
import { uploadCsv } from '../utils';

export const schoolRouter = Router();

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
);

schoolRouter.get('', verifyUserIsAuthenticated, listSchoolController);

schoolRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
);

export const classRouter = Router();

classRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
);

classRouter.get('', verifyUserIsAuthenticated, listClassController);

export const studentRouter = Router();

studentRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentCreateSchema),
  createStudentController,
);

studentRouter.post(
  '/import/:class_id/:school_id',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importStudentController,
);

studentRouter.get('', verifyUserIsAuthenticated, listStudentController);

studentRouter.get('/:id', verifyUserIsAuthenticated, retrieveStudentController);

export const frequencyRouter = Router();

frequencyRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentCreateSchema),
  createFrequencyStudentController,
);

frequencyRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyCreateSchema),
  createFrequencyController,
);

frequencyRouter.get('', verifyUserIsAuthenticated, listFrequencyController);

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
);

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
);

frequencyRouter.get(
  '/student',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
);

frequencyRouter.patch(
  '/student/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
);

export const reportRouter = Router();

reportRouter.get('/:id', listReportController);
