import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolListArraySchema } from '../../schemas';
import { schoolArrParseFrequency } from '../../scripts';

export const listSchoolService = async ({
  is_active,
  year_id,
  take,
  is_dash,
  is_listSchool,
  is_director,
  school_infreq,
}: ISchoolQuery) => {
  if (take) {
    take = +take;
  }

  if (is_director) {
    const schools = await prisma.school.findMany({
      where: { AND: { is_active: true, director_id: { equals: null } } },
      orderBy: { name: 'asc' },
      include: {
        director: true,
        servers: { include: { server: true } },
        classes: { include: { class: true } },
      },
    });
    return SchoolArraySchema.parse(schools);
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
      where: {
        AND: {
          is_active: true,
          school_infreq: { gt: 0 },
          classes: { every: { year_id } },
        },
      },
      orderBy: { school_infreq: 'desc' },
      include: {
        director: true,
        classes: {
          include: {
            _count: { select: { students: { where: { year_id } } } },
            class: true,
            students: { include: { student: true } },
          },
          orderBy: { class_infreq: 'desc' },
        },
      },
    });
    const schoolsReturn = await schoolArrParseFrequency(schoolFreq, year_id);

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

  if (is_listSchool) {
    if (school_infreq) {
      school_infreq = +school_infreq;
    }

    let schoolList = await prisma.school.findMany({
      take,
      orderBy: { name: 'asc' },
      where: { school_infreq: { gte: school_infreq ? school_infreq : 0 } },
      include: {
        director: true,
        classes: {
          where: { year_id },
          include: {
            _count: {
              select: {
                students: { where: { is_active: true } },
                frequencies: true,
              },
            },
          },
        },
        _count: { select: { classes: { where: { year_id } } } },
      },
    });

    if (is_active) {
      switch (is_active) {
      case 'true':
        schoolList = schoolList.filter((school) => school.is_active === true);
        break;
      case 'false':
        schoolList = schoolList.filter(
          (school) => school.is_active === false,
        );
        break;
      }
    }

    const schoolsReturn = schoolList.map((el) => {
      let num_students = 0;
      let num_frequencies = 0;
      el.classes.forEach((el) => {
        num_students += el._count.students;
        num_frequencies += el._count.frequencies;
      });
      return {
        ...el,
        num_students,
        num_frequencies,
        num_classes: el._count.classes,
      };
    });

    return SchoolListArraySchema.parse(schoolsReturn);
  }

  if (year_id) {
    const schoolFreq = await prisma.school.findMany({
      take,
      orderBy: { name: 'asc' },
      include: {
        director: true,
        classes: {
          include: {
            class: true,
            students: {
              where: { is_active: true },
              include: { student: true },
            },
          },
        },
      },
    });
    const schoolsReturn = await schoolArrParseFrequency(schoolFreq, year_id);
    return SchoolArraySchema.parse(schoolsReturn);
  }

  return SchoolArraySchema.parse(schools);
};
