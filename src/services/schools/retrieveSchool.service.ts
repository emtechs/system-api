import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolListReturnSchema, SchoolReturnSchema } from '../../schemas';
import { schoolClassParseFrequency } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id, is_listSchool }: ISchoolQuery,
) => {
  if (is_listSchool) {
    const schoolList = await prisma.school.findUnique({
      where: { id },
      include: {
        director: true,
        servers: { include: { server: true } },
        classes: {
          where: { year_id },
          include: {
            _count: true,
          },
        },
        _count: { select: { classes: { where: { year_id } } } },
      },
    });

    let num_students = 0;
    let num_frequencies = 0;
    schoolList.classes.forEach((el) => {
      num_students += el._count.students;
      num_frequencies += el._count.frequencies;
    });
    const schoolsReturn = {
      ...schoolList,
      num_students,
      num_frequencies,
      num_classes: schoolList._count.classes,
    };

    return SchoolListReturnSchema.parse(schoolsReturn);
  }

  if (year_id) {
    const schoolFreq = await prisma.school.findUnique({
      where: {
        id,
      },
      include: {
        director: true,
        classes: {
          include: {
            _count: { select: { students: { where: { year_id } } } },
            class: true,
            students: {
              where: { student: { infreq: { gt: 0 } } },
              include: { student: true },
              orderBy: { student: { infreq: 'desc' } },
            },
          },
          orderBy: { class_infreq: 'desc' },
        },
      },
    });
    const schoolsReturn = await schoolClassParseFrequency(
      schoolFreq,
      year_id,
    );

    return SchoolReturnSchema.parse(schoolsReturn);
  }
};
