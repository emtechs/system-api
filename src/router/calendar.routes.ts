import { Router } from 'express';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { MonthCreateSchema, SchoolYearCreateSchema } from '../schemas';
import {
  createMonthController,
  createYearController,
  exportYearController,
  listMonthController,
  listYearController,
  retrieveYearController,
} from '../controllers';

export const calendarRouter = Router();

calendarRouter.post(
  '/year',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolYearCreateSchema),
  createYearController,
);

calendarRouter.post(
  '/month',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(MonthCreateSchema),
  createMonthController,
);

calendarRouter.get('/year', verifyUserIsAuthenticated, listYearController);

calendarRouter.get(
  '/year/:year',
  verifyUserIsAuthenticated,
  retrieveYearController,
);

calendarRouter.get('/month', verifyUserIsAuthenticated, listMonthController);

calendarRouter.get(
  '/export/year',
  verifyUserIsAuthenticated,
  exportYearController,
);
