import { IQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (
  id: string,
  { school_id }: IQuery,
) => {
  let where_frequency = {};
  let user = {};

  if (school_id) {
    where_frequency = { ...where_frequency, school_id };

    const schoolData = await prisma.schoolServer.findUnique({
      where: { school_id_server_id: { school_id, server_id: id } },
      select: {
        dash: true,
        role: true,
        school: { select: { id: true, name: true } },
      },
    });

    if (schoolData) {
      const { dash, role, school } = schoolData;

      user = { ...user, school: { dash, role, ...school } };
    }
  }

  where_frequency = { ...where_frequency, user_id: id };

  const [userData, frequencies] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.frequency.count({
      where: where_frequency,
    }),
  ]);

  user = { ...user, ...userData, frequencies };

  return UserReturnSchema.parse(user);
};
