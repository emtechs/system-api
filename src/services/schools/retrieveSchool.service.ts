import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolListReturnSchema, SchoolReturnSchema } from '../../schemas';
import { schoolClassParseFrequency } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id, is_listSchool }: ISchoolQuery,
) => {
  if (is_listSchool) {
    const [schoolList, { value: infrequency }] = await Promise.all([
      prisma.school.findUnique({
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
      }),
      prisma.schoolInfrequency.findUnique({
        where: { year_id_school_id: { school_id: id, year_id } },
        select: { value: true },
      }),
    ]);

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
      infrequency,
    };

    return SchoolListReturnSchema.parse(schoolsReturn);
  }

  if (year_id) {
    const [schoolFreq, { value: infrequency }] = await Promise.all([
      prisma.school.findUnique({
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
                where: {
                  student: { infrequencies: { every: { value: { gt: 0 } } } },
                },
                include: {
                  student: {
                    include: { infrequencies: { orderBy: { value: 'desc' } } },
                  },
                },
              },
            },
            orderBy: { infrequency: 'desc' },
          },
        },
      }),
      prisma.schoolInfrequency.findUnique({
        where: { year_id_school_id: { school_id: id, year_id } },
        select: { value: true },
      }),
    ]);

    const schoolsFrequency = await schoolClassParseFrequency(
      schoolFreq,
      year_id,
    );

    const schoolsReturn = SchoolReturnSchema.parse(schoolsFrequency);

    return { ...schoolsReturn, infrequency };
  }

  const school = await prisma.school.findUnique({
    where: { id },
    include: { director: true },
  });

  return SchoolReturnSchema.parse(school);
};
