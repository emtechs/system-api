import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolFreqArraySchema } from '../../schemas';
import { schoolArrParseFrequency } from '../../scripts';

export const listSchoolService = async ({
  is_active,
  school_year_id,
  take,
}: ISchoolQuery) => {
  let schools = await prisma.school.findMany({
    orderBy: { name: 'asc' },
    include: {
      director: true,
      servers: { include: { server: true } },
      classes: { include: { class: true } },
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

  if (school_year_id) {
    if (take) {
      take = +take;
    }
    const schoolFreq = await prisma.school.findMany({
      take,
      orderBy: { name: 'asc' },
      include: {
        director: true,
        classes: {
          include: { class: true, students: { include: { student: true } } },
        },
      },
    });
    const schoolsReturn = await schoolArrParseFrequency(
      schoolFreq,
      school_year_id,
    );
    return SchoolFreqArraySchema.parse(schoolsReturn);
  }

  return SchoolArraySchema.parse(schools);
};
