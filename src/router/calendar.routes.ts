import { Router } from 'express';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { YearCreateSchema } from '../schemas';
import {
  createYearController,
  exportYearController,
  listCalendarController,
  listCalendarFrequencyController,
  listCalendarStudentController,
  listYearController,
  retrieveYearController,
} from '../controllers';

export const calendarRouter = Router();

calendarRouter.post(
  '/year',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(YearCreateSchema),
  createYearController,
);

calendarRouter.get(
  '/frequency/:year_id/:school_id/:class_id',
  verifyUserIsAuthenticated,
  listCalendarFrequencyController,
);

calendarRouter.get(
  '/student/:student_id',
  verifyUserIsAuthenticated,
  listCalendarStudentController,
);

calendarRouter.get('/year', verifyUserIsAuthenticated, listYearController);

calendarRouter.get(
  '/year/:year',
  verifyUserIsAuthenticated,
  retrieveYearController,
);

calendarRouter.get(
  '/export/year',
  verifyUserIsAuthenticated,
  exportYearController,
);

calendarRouter.get(
  '/:year_id',
  verifyUserIsAuthenticated,
  listCalendarController,
);
