import { AppError } from '../../errors';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (id: string) => {
  const [user, yearsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        director_school: true,
        work_school: {
          include: {
            school: true,
          },
        },
      },
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

  if (!user) throw new AppError('user not found', 404);

  return { user: UserReturnSchema.parse(user), years };
};
