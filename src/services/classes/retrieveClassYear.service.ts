import prisma from '../../prisma';
import { ClassSchoolFrequencyReturnSchema } from '../../schemas';
import { classParseFrequency } from '../../scripts';

export const retrieveClassYearService = async (
  class_id: string,
  school_id: string,
  year_id: string,
) => {
  const classShool = await prisma.classYear.findUnique({
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
