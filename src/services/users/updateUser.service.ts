import { compareSync, hashSync } from 'bcryptjs';
import { AppError } from '../../errors';
import { IUserUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const updateUserService = async (
  id: string,
  {
    name,
    email,
    login,
    old_password,
    password,
    phone,
    role,
    is_first_access,
    is_active,
  }: IUserUpdateRequest,
  role_user: string,
) => {
  if (role) {
    if (role_user !== 'ADMIN') {
      throw new AppError('User is not allowed to change his role', 400);
    }
  }

  if (is_active) {
    if (role_user !== 'ADMIN') {
      throw new AppError('User is not allowed to change his is_active', 400);
    }
  }

  if (old_password && password) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      const passwordMatch = compareSync(old_password, user.password);
      if (!passwordMatch) {
        throw new AppError('old password does not match', 400);
      }
      password = hashSync(password, 10);
    }
  }

  if (login) {
    const user = await prisma.user.findUnique({ where: { login } });
    if (user && user.id !== id) {
      throw new AppError(`${login} already exists`, 409);
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        login,
        password,
        phone,
        role,
        is_first_access,
        is_active,
      },
    });

    return UserReturnSchema.parse(user);
  } catch {
    throw new AppError('user not found', 404);
  }
};
