import { IQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (
  id: string,
  { school_id }: IQuery,
) => {
  let where_frequency = {};

  if (school_id) where_frequency = { ...where_frequency, school_id };

  where_frequency = { ...where_frequency, user_id: id };

  const [userData, frequencies] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.frequency.count({
      where: where_frequency,
    }),
  ]);

  const user = { ...userData, frequencies };

  return UserReturnSchema.parse(user);
};
