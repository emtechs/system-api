import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserArraySchema } from '../../schemas';

export const listUserService = async ({
  role,
  is_active,
  isNot_director_school,
}: IUserQuery) => {
  let users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
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

  users = role ? users.filter((user) => role === user.role) : users;

  users = is_active
    ? users.filter((user) => user.is_active === is_active)
    : users;

  users = isNot_director_school
    ? users.filter((user) => !user.director_school)
    : users;

  return UserArraySchema.parse(users);
};
