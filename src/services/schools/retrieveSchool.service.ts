import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { schoolClassParseFrequency } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { school_year_id }: ISchoolQuery,
) => {
  if (school_year_id) {
    const schoolFreq = await prisma.school.findUnique({
      where: {
        id,
      },
      include: {
        director: true,
        classes: {
          include: {
            _count: { select: { students: { where: { school_year_id } } } },
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
      school_year_id,
    );

    return SchoolReturnSchema.parse(schoolsReturn);
  }
};
