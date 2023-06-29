import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';

export const retrieveSchoolService = async (id: string) => {
  const select = {
    id: true,
    name: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const school = await prisma.school.findUnique({
    where: { id },
    select,
  });

  return SchoolReturnSchema.parse(school);
};
