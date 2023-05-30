import prisma from '../../prisma';
import { ClassSchoolReturnSchema } from '../../schemas';

export const retrieveClassSchoolService = async (
  class_id: string,
  school_id: string,
  school_year_id: string,
) => {
  const classShool = await prisma.classSchool.findUnique({
    where: {
      class_id_school_id_school_year_id: {
        class_id,
        school_id,
        school_year_id,
      },
    },
    include: {
      school: true,
      school_year: true,
      class: true,
      students: { include: { student: true } },
      _count: { select: { frequencies: true, students: true } },
    },
  });

  return ClassSchoolReturnSchema.parse(classShool);
};
