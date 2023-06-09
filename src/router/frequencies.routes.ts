import { Router } from 'express';
import {
  createFrequencyController,
  deleteFrequencyController,
  listFrequencyController,
  listFrequencyHistoryController,
  listFrequencyStudentController,
  listInfrequencyController,
  retrieveFrequencyController,
  updateFrequencyController,
  updateFrequencyStudentController,
  updateInfrequencyController,
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
  '/infrequency',
  verifyUserIsAuthenticated,
  listInfrequencyController,
);

frequencyRouter.get(
  '/history',
  verifyUserIsAuthenticated,
  listFrequencyHistoryController,
);

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
);

frequencyRouter.get(
  '/:id/student',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
);

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
);

frequencyRouter.patch(
  '/student/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
);

frequencyRouter.patch(
  '/infreq/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateInfrequencyController,
);

frequencyRouter.delete(
  '/:id',
  verifyUserIsAuthenticated,
  deleteFrequencyController,
);
