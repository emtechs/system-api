import prisma from '../../prisma';
import { SchoolArraySchema } from '../../schemas';

export const listSchoolService = async () => {
  const schools = await prisma.school.findMany({
    include: {
      director: true,
      servers: { include: { server: true } },
      frequencies: {
        include: { class: true, students: { include: { student: true } } },
      },
    },
  });
  return SchoolArraySchema.parse(schools);
};
