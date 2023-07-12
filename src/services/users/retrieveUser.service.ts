import { AppError } from '../../errors';
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

  const [userData, frequencies, yearsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.frequency.count({
      where: where_frequency,
    }),
    prisma.period.findMany({
      where: { frequencies: { some: { frequency: { user_id: id } } } },
      select: { year: { select: { id: true, year: true } } },
      distinct: ['year_id'],
      orderBy: { year: { year: 'desc' } },
    }),
  ]);

  const years = yearsData.map((el) => {
    return { id: el.year.id, year: el.year.year };
  });

  if (!userData) throw new AppError('user not found', 404);

  const user = { ...userData, frequencies };

  return { user: UserReturnSchema.parse(user), years };
};
