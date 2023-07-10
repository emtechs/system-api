import { AppError } from '../../errors';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (id: string) => {
  const [userData, yearsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { frequencies: { where: { status: 'CLOSED' } } } },
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

  if (!userData) throw new AppError('user not found', 404);

  let frequencies = 0;

  if (userData._count.frequencies) frequencies = userData._count.frequencies;

  const user = { ...userData, frequencies };

  return { user: UserReturnSchema.parse(user), years };
};
