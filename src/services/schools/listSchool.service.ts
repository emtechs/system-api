import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema } from '../../schemas';
import { schoolArrParseFrequency } from '../../scripts';

export const listSchoolService = async ({
  is_active,
  school_year_id,
  take,
  is_dash,
}: ISchoolQuery) => {
  if (take) {
    take = +take;
  }
  let schools = await prisma.school.findMany({
    take,
    orderBy: { name: 'asc' },
    include: {
      director: true,
      servers: { include: { server: true } },
      classes: { include: { class: true } },
    },
  });

  if (is_dash) {
    const schoolFreq = await prisma.school.findMany({
      take,
      where: { AND: { is_active: true, school_infreq: { gt: 0 } } },
      orderBy: { school_infreq: 'desc' },
      include: {
        director: true,
        classes: {
          include: { class: true, students: { include: { student: true } } },
          orderBy: { class_infreq: 'desc' },
        },
      },
    });
    const schoolsReturn = await schoolArrParseFrequency(
      schoolFreq,
      school_year_id,
    );
    return SchoolArraySchema.parse(schoolsReturn);
  }

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
    return SchoolArraySchema.parse(schoolsReturn);
  }

  return SchoolArraySchema.parse(schools);
};
