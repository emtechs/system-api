import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolFrequencyReturnSchema } from '../../schemas';
import { classParseFrequency } from '../../scripts';

export const retrieveClassSchoolService = async (
  class_id: string,
  school_id: string,
  year_id: string,
  { is_infreq }: IClassQuery,
) => {
  if (is_infreq) {
    const classShool = await prisma.classSchool.findUnique({
      where: {
        class_id_school_id_year_id: {
          class_id,
          school_id,
          year_id,
        },
      },
      include: {
        school: true,
        year: true,
        class: true,
        students: {
          include: { student: true },
          orderBy: { student: { name: 'asc' } },
          where: {
            student: {
              infrequencies: { every: { value: { gt: 0 }, year_id } },
            },
          },
        },
        _count: { select: { frequencies: true, students: true } },
      },
    });
    const classRetun = await classParseFrequency(classShool, year_id);

    return ClassSchoolFrequencyReturnSchema.parse(classRetun);
  }

  const classShool = await prisma.classSchool.findUnique({
    where: {
      class_id_school_id_year_id: {
        class_id,
        school_id,
        year_id,
      },
    },
    include: {
      school: true,
      year: true,
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
      _count: { select: { frequencies: true, students: true } },
    },
  });

  const classRetun = await classParseFrequency(classShool, year_id);

  return ClassSchoolFrequencyReturnSchema.parse(classRetun);
};
