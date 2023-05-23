import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema } from '../../schemas';

export const listSchoolService = async ({ is_active }: ISchoolQuery) => {
  let schools = await prisma.school.findMany({
    include: {
      director: true,
      servers: { include: { server: true } },
    },
  });

  if (is_active) {
    switch (is_active) {
    case 'true':
      schools = schools.filter((school) => school.is_active === true);
      break;
    case 'false':
      schools = schools.filter((school) => school.is_active === false);
      break;
    }
  }

  return SchoolArraySchema.parse(schools);
};
