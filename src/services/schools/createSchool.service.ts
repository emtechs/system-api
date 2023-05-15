import prisma from '../../prisma';
import { ISchoolRequest } from '../../interfaces';
import { SchoolReturnSchema } from '../../schemas';

export const createSchoolService = async ({
  name,
  director_id,
}: ISchoolRequest) => {
  const school = await prisma.school.create({
    data: {
      name,
      director_id,
      servers: { create: { server_id: director_id, dash: 'SCHOOL' } },
    },
  });

  return SchoolReturnSchema.parse(school);
};
