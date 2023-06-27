import { Router } from 'express';
import {
  createClassController,
  createClassSchoolController,
  createClassStudentController,
  dashClassController,
  exportClassController,
  listClassController,
  listClassDashController,
  listClassSchoolController,
  listClassSchoolWithSchoolController,
  listClassStudentController,
  retrieveClassSchoolController,
  updateClassSchoolController,
  updateClassStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyIsPermission,
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
  verifyIsPermission,
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
  '/school/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  listClassSchoolWithSchoolController,
);

classRouter.get(
  '/school/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  listClassDashController,
);

classRouter.get(
  '/year/:id',
  verifyUserIsAuthenticated,
  listClassSchoolController,
);

classRouter.get(
  '/student/:year_id',
  verifyUserIsAuthenticated,
  listClassStudentController,
);

classRouter.get(
  '/:class_id/:school_id/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  retrieveClassSchoolController,
);

classRouter.get(
  '/:class_id/:school_id/:year_id/dash',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  dashClassController,
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
