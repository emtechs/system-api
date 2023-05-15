import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  listUserController,
  profileUserController,
  retrieveUserController,
  retrieveUserWithCpfController,
  updateUserController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { UserCreateSchema, UserUpdateRequestSchema } from '../schemas';

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

userRouter.get(
  '/cpf/:cpf',
  verifyUserIsAuthenticated,
  retrieveUserWithCpfController,
);

userRouter.get('/:id', verifyUserIsAuthenticated, retrieveUserController);

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
