import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolListArraySchema } from '../../schemas';
import { schoolArrParseFrequency } from '../../scripts';

export const listSchoolService = async ({
  name,
  is_active,
  infreq,
  year_id,
  is_dash,
  is_listSchool,
  is_director,
  take,
  skip,
  order,
  by,
}: ISchoolQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;

    case 'director_name':
      orderBy = { director: { name: by } };
      break;

    case 'infreq':
      orderBy = { infreq: by };
      break;
    }
  }

  if (name)
    whereData = { ...whereData, name: { contains: name, mode: 'insensitive' } };

  if (infreq) {
    infreq = +infreq;
    whereData = { ...whereData, infreq: { gte: infreq } };
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereData = { ...whereData, is_active: true };
      break;

    case 'false':
      whereData = { ...whereData, is_active: false };
      break;
    }
  }

  if (is_director) {
    whereData = { ...whereData, director_id: { equals: null } };

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        take,
        skip,
        where: { ...whereData },
        orderBy,
      }),
      prisma.school.count({ where: { ...whereData } }),
    ]);

    const schoolsSchema = SchoolArraySchema.parse(schools);

    return {
      total,
      result: schoolsSchema,
    };
  }

  if (is_dash) {
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
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
      }),
      prisma.school.count({
        where: {
          AND: {
            is_active: true,
            infreq: { gt: 0 },
            classes: { every: { year_id } },
          },
        },
      }),
    ]);

    const schoolsReturn = await schoolArrParseFrequency(schools, year_id);

    const schoolsSchema = SchoolArraySchema.parse(schoolsReturn);

    return {
      total,
      result: schoolsSchema,
    };
  }

  if (is_listSchool) {
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        take,
        skip,
        where: { ...whereData },
        orderBy,
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
      }),
      prisma.school.count({
        where: { ...whereData },
      }),
    ]);

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

    return {
      total,
      result: schoolsSchema,
    };
  }

  const [schools, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      take,
      skip,
      where: { ...whereData },
      orderBy,
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
    }),
    prisma.school.count({ where: { ...whereData } }),
    prisma.school.findMany({
      where: { ...whereData },
      orderBy,
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
    }),
  ]);

  const schoolsData = SchoolArraySchema.parse(schoolsLabel).map((el) => {
    return {
      id: el.id,
      label: el.name,
      ...el,
    };
  });

  if (year_id) {
    const schoolsReturn = await schoolArrParseFrequency(schools, year_id);

    const schoolsSchema = SchoolArraySchema.parse(schoolsReturn);

    return {
      schools: schoolsData,
      total,
      result: schoolsSchema,
    };
  }

  const schoolsSchema = SchoolArraySchema.parse(schools);

  return { schools: schoolsData, total, result: schoolsSchema };
};
