import { Router } from 'express';
import {
  createSchoolController,
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
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { SchoolCreateSchema, SchoolUpdateSchema } from '../schemas';

export const schoolRouter = Router();

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
);

schoolRouter.get('', verifyUserIsAuthenticated, listSchoolController);

schoolRouter.get('/export', verifyUserIsAuthenticated, exportSchoolController);

schoolRouter.get(
  '/list/:year_id',
  verifyUserIsAuthenticated,
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
