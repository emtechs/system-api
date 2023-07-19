import { Router } from 'express';
import {
  createClassController,
  createClassSchoolController,
  createClassStudentController,
  dashClassController,
  deleteClassStudentController,
  exportClassController,
  listClassController,
  listClassDashController,
  listClassStudentController,
  listClassYearController,
  retrieveClassController,
  retrieveClassYearController,
  transferClassStudentController,
  updateClassSchoolController,
  updateClassStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  ClassSchoolCreateSchema,
  ClassSchoolUpdateSchema,
  ClassStudentCreateSchema,
  ClassStudentUpdateSchema,
  DeleteClassStudentSchema,
  TransferClassStudentSchema,
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

classRouter.get(
  '/year/:year_id',
  verifyUserIsAuthenticated,
  listClassYearController,
);

classRouter.get(
  '/year/:year_id/:class_id/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  retrieveClassYearController,
);

classRouter.get('/export', verifyUserIsAuthenticated, exportClassController);

classRouter.get(
  '/school/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  listClassDashController,
);

classRouter.get(
  '/student/:year_id',
  verifyUserIsAuthenticated,
  listClassStudentController,
);

classRouter.get(
  '/:class_id',
  verifyUserIsAuthenticated,
  retrieveClassController,
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

classRouter.patch(
  '/transfer',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(TransferClassStudentSchema),
  transferClassStudentController,
);

classRouter.delete(
  '/:key',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(DeleteClassStudentSchema),
  deleteClassStudentController,
);
