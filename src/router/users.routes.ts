import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  listUserController,
  profileUserController,
  retrieveUserController,
  updatePasswordController,
  updateUserController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  PasswordUpdateSchema,
  UserCreateSchema,
  UserUpdateRequestSchema,
} from '../schemas';

export const userRouter = Router();

userRouter.post(
  '',
  validateSchemaMiddleware(UserCreateSchema),
  createUserController,
);

userRouter.get(
  '',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  listUserController,
);

userRouter.get('/profile', verifyUserIsAuthenticated, profileUserController);

userRouter.get('/:id', verifyUserIsAuthenticated, retrieveUserController);

userRouter.patch(
  '/password',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(PasswordUpdateSchema),
  updatePasswordController,
);

userRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(UserUpdateRequestSchema),
  updateUserController,
);

userRouter.delete(
  '/:id',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  deleteUserController,
);
