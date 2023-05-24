import prisma from '../../prisma';
import { ISchoolRequest } from '../../interfaces';
import { SchoolReturnSchema } from '../../schemas';

export const createSchoolService = async ({ name }: ISchoolRequest) => {
  const school = await prisma.school.create({
    data: {
      name,
    },
  });

  return school;

  // return SchoolReturnSchema.parse(school);
};
