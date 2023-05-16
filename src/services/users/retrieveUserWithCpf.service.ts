import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserWithCpfService = async (login: string) => {
  const user = await prisma.user.findUnique({
    where: { login },
    include: {
      director_school: true,
      work_school: {
        include: {
          school: {
            include: {
              frequencies: {
                include: {
                  class: true,
                  students: { include: { student: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  return UserReturnSchema.parse(user);
};
