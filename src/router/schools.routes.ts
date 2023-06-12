import { Router } from 'express';
import {
  createSchoolController,
  deleteDirectorSchoolController,
  deleteSchoolController,
  deleteSchoolServerController,
  exportSchoolController,
  listSchoolController,
  listSchoolServerController,
  retrieveSchoolController,
  updateSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
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

schoolRouter.get('/:id', verifyUserIsAuthenticated, retrieveSchoolController);

schoolRouter.get(
  '/:id/server',
  verifyUserIsAuthenticated,
  listSchoolServerController,
);

schoolRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
);

schoolRouter.delete('/:id', verifyUserIsAuthenticated, deleteSchoolController);

schoolRouter.delete(
  '/:id/director',
  verifyUserIsAuthenticated,
  deleteDirectorSchoolController,
);

schoolRouter.delete(
  '/:school_id/server/:server_id',
  verifyUserIsAuthenticated,
  deleteSchoolServerController,
);
