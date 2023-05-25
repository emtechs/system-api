import { Router } from 'express';
import {
  createClassController,
  exportClassController,
  listClassController,
  listClassWithSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { ClassCreateSchema } from '../schemas';

export const classRouter = Router();

classRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
);

classRouter.get('', verifyUserIsAuthenticated, listClassController);

classRouter.get('/export', verifyUserIsAuthenticated, exportClassController);

classRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  listClassWithSchoolController,
);
