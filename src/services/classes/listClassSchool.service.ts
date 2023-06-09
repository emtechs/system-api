import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolArraySchema } from '../../schemas';

export const listClassSchoolService = async (
  year_id: string,
  { take, skip, class_infreq }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;
  if (class_infreq) class_infreq = +class_infreq;

  const classes = await prisma.classSchool.findMany({
    take,
    skip,
    where: {
      AND: { year_id, class: { is_active: true } },
      class_infreq: { gte: class_infreq },
    },
    orderBy: { class: { name: 'asc' } },
    include: { class: true, school: true, year: true, _count: true },
  });

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  const total = await prisma.classSchool.count({
    where: {
      AND: { year_id, class: { is_active: true } },
      class_infreq: { gte: class_infreq },
    },
  });

  return {
    total,
    result: classesSchema,
  };
};
