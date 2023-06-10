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
  skip,
}: ISchoolQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  if (is_director) {
    const schools = await prisma.school.findMany({
      take,
      skip,
      where: { AND: { is_active: true, director_id: { equals: null } } },
      orderBy: { name: 'asc' },
      include: {
        director: true,
        servers: { include: { server: true } },
        classes: { include: { class: true } },
      },
    });

    const schoolsSchema = SchoolArraySchema.parse(schools);

    const total = await prisma.school.count({
      where: { AND: { is_active: true, director_id: { equals: null } } },
    });

    return {
      total,
      result: schoolsSchema,
    };
  }

  if (is_dash) {
    const schools = await prisma.school.findMany({
      take,
      skip,
      where: {
        AND: {
          is_active: true,
          infreq: { gt: 0 },
          classes: { every: { year_id } },
        },
      },
      orderBy: { infreq: 'desc' },
      include: {
        director: true,
        classes: {
          include: {
            _count: { select: { students: { where: { year_id } } } },
            class: true,
            students: { include: { student: true } },
          },
          orderBy: { infreq: 'desc' },
        },
      },
    });
    const schoolsReturn = await schoolArrParseFrequency(schools, year_id);

    const schoolsSchema = SchoolArraySchema.parse(schoolsReturn);

    const total = await prisma.school.count({
      where: {
        AND: {
          is_active: true,
          infreq: { gt: 0 },
          classes: { every: { year_id } },
        },
      },
    });

    return {
      total,
      result: schoolsSchema,
    };
  }

  if (is_listSchool) {
    if (school_infreq) {
      school_infreq = +school_infreq;
    }

    let schools = await prisma.school.findMany({
      take,
      skip,
      orderBy: { name: 'asc' },
      where: { infreq: { gte: school_infreq ? school_infreq : 0 } },
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
        schools = schools.filter((school) => school.is_active === true);
        break;
      case 'false':
        schools = schools.filter((school) => school.is_active === false);
        break;
      }
    }

    const schoolsReturn = schools.map((el) => {
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

    const schoolsSchema = SchoolListArraySchema.parse(schoolsReturn);

    const total = await prisma.school.count({
      where: { infreq: { gte: school_infreq ? school_infreq : 0 } },
    });

    return {
      total,
      result: schoolsSchema,
    };
  }

  if (year_id) {
    const schools = await prisma.school.findMany({
      take,
      skip,
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
    const schoolsReturn = await schoolArrParseFrequency(schools, year_id);

    const schoolsSchema = SchoolArraySchema.parse(schoolsReturn);

    const total = await prisma.school.count({});

    return {
      total,
      result: schoolsSchema,
    };
  }

  let schools = await prisma.school.findMany({
    take,
    skip,
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

  const schoolsSchema = SchoolArraySchema.parse(schools);

  const total = await prisma.school.findMany({});

  return {
    total,
    result: schoolsSchema,
  };
};
