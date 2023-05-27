import { Router } from 'express';
import {
  createFrequencyController,
  listFrequencyController,
  listFrequencyStudentController,
  retrieveFrequencyController,
  updateFrequencyController,
  updateFrequencyStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  FrequencyCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
} from '../schemas';

export const frequencyRouter = Router();

frequencyRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyCreateSchema),
  createFrequencyController,
);

frequencyRouter.get('', verifyUserIsAuthenticated, listFrequencyController);

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
);

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
);

frequencyRouter.get(
  '/student',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
);

frequencyRouter.patch(
  '/student/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
);
