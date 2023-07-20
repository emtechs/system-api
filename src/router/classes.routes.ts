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
  '/year/:key',
  verifyUserIsAuthenticated,
  listClassYearController,
);

classRouter.get(
  '/year/:key/view',
  verifyUserIsAuthenticated,
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
  '/transfer',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(TransferClassStudentSchema),
  transferClassStudentController,
);

classRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassStudentUpdateSchema),
  updateClassStudentController,
);

classRouter.delete(
  '/:key',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(DeleteClassStudentSchema),
  deleteClassStudentController,
);
