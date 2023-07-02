import { Router } from 'express';
import {
  createSchoolController,
  createSchoolServerController,
  dashSchoolController,
  deleteDirectorSchoolController,
  deleteSchoolController,
  deleteSchoolServerController,
  exportSchoolController,
  listSchoolClassController,
  listSchoolController,
  listSchoolServerController,
  reportSchoolController,
  retrieveSchoolClassController,
  retrieveSchoolController,
  updateSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  SchoolCreateSchema,
  SchoolServerCreateSchema,
  SchoolUpdateSchema,
} from '../schemas';

export const schoolRouter = Router();

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
);

schoolRouter.post(
  '/:server_id',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(SchoolServerCreateSchema),
  createSchoolServerController,
);

schoolRouter.get(
  '',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  listSchoolController,
);

schoolRouter.get('/export', verifyUserIsAuthenticated, exportSchoolController);

schoolRouter.get(
  '/list/:year_id',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  listSchoolClassController,
);

schoolRouter.get(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  retrieveSchoolController,
);

schoolRouter.get(
  '/:school_id/server',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  listSchoolServerController,
);

schoolRouter.get(
  '/:school_id/year/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  retrieveSchoolClassController,
);

schoolRouter.get(
  '/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  dashSchoolController,
);

schoolRouter.get(
  '/:school_id/report/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  reportSchoolController,
);

schoolRouter.patch(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
);

schoolRouter.delete(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteSchoolController,
);

schoolRouter.delete(
  '/:school_id/director',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteDirectorSchoolController,
);

schoolRouter.delete(
  '/:school_id/server/:server_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteSchoolServerController,
);
