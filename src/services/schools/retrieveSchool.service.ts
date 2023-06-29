import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';

export const retrieveSchoolService = async (id: string) => {
  const school = await prisma.school.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      director_id: true,
      director: { select: { id: true, cpf: true, name: true } },
    },
  });

  return SchoolReturnSchema.parse(school);
};
