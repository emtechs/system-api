import prisma from '../../prisma';
import { UserArraySchema } from '../../schemas';

export const listUserService = async () => {
  const users = await prisma.user.findMany();

  return UserArraySchema.parse(users);
};
