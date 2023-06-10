import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolArraySchema } from '../../schemas';

export const listClassSchoolService = async (
  year_id: string,
  { take, skip, infreq }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;
  if (infreq) infreq = +infreq;

  const classes = await prisma.classSchool.findMany({
    take,
    skip,
    where: {
      AND: { year_id, class: { is_active: true } },
      infreq: { gte: infreq },
    },
    orderBy: { class: { name: 'asc' } },
    include: { class: true, school: true, year: true, _count: true },
  });

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  const total = await prisma.classSchool.count({
    where: {
      AND: { year_id, class: { is_active: true } },
      infreq: { gte: infreq },
    },
  });

  return {
    total,
    result: classesSchema,
  };
};
