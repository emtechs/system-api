import { Router } from 'express';
import {
  createSchoolController,
  createSchoolYearController,
  exportSchoolController,
  exportSchoolYearController,
  listSchoolController,
  listSchoolYearController,
  retrieveSchoolYearController,
  updateSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  SchoolCreateSchema,
  SchoolUpdateSchema,
  SchoolYearCreateSchema,
} from '../schemas';

export const schoolRouter = Router();

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
);

schoolRouter.post(
  '/year',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolYearCreateSchema),
  createSchoolYearController,
);

schoolRouter.get('', verifyUserIsAuthenticated, listSchoolController);

schoolRouter.get('/year', verifyUserIsAuthenticated, listSchoolYearController);

schoolRouter.get(
  '/year/:year',
  verifyUserIsAuthenticated,
  retrieveSchoolYearController,
);

schoolRouter.get('/export', verifyUserIsAuthenticated, exportSchoolController);

schoolRouter.get(
  '/export/year',
  verifyUserIsAuthenticated,
  exportSchoolYearController,
);

schoolRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
);
