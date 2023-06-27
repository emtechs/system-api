import { Router } from 'express';
import {
  createSchoolController,
  dashSchoolController,
  deleteDirectorSchoolController,
  deleteSchoolController,
  deleteSchoolServerController,
  exportSchoolController,
  listSchoolController,
  listSchoolServerController,
  reportSchoolController,
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
  '/:school_id',
  verifyUserIsAuthenticated,
  retrieveSchoolController,
);

schoolRouter.get(
  '/:school_id/server',
  verifyUserIsAuthenticated,
  listSchoolServerController,
);

schoolRouter.get(
  '/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
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
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
);

schoolRouter.delete(
  '/:school_id',
  verifyUserIsAuthenticated,
  deleteSchoolController,
);

schoolRouter.delete(
  '/:school_id/director',
  verifyUserIsAuthenticated,
  deleteDirectorSchoolController,
);

schoolRouter.delete(
  '/:school_id/server/:server_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteSchoolServerController,
);
