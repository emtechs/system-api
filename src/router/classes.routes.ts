import { Router } from 'express';
import {
  createClassController,
  createClassSchoolController,
  createClassStudentController,
  exportClassController,
  listClassController,
  listClassSchoolController,
  listClassSchoolWithSchoolController,
  retrieveClassSchoolController,
  updateClassSchoolController,
  updateClassStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  ClassSchoolCreateSchema,
  ClassSchoolUpdateSchema,
  ClassStudentCreateSchema,
  ClassStudentUpdateSchema,
} from '../schemas';

export const classRouter = Router();

classRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
);

classRouter.post(
  '/:year_id/:school_id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassSchoolCreateSchema),
  createClassSchoolController,
);

classRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassStudentCreateSchema),
  createClassStudentController,
);

classRouter.get('', verifyUserIsAuthenticated, listClassController);

classRouter.get('/export', verifyUserIsAuthenticated, exportClassController);

classRouter.get(
  '/school/:id',
  verifyUserIsAuthenticated,
  listClassSchoolWithSchoolController,
);

classRouter.get(
  '/year/:id',
  verifyUserIsAuthenticated,
  listClassSchoolController,
);

classRouter.get(
  '/:class_id/:school_id/:year_id',
  verifyUserIsAuthenticated,
  retrieveClassSchoolController,
);

classRouter.patch(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassSchoolUpdateSchema),
  updateClassSchoolController,
);

classRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassStudentUpdateSchema),
  updateClassStudentController,
);
