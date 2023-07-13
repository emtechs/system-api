import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { classYearReturn, schoolReturn } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id, class_id }: ISchoolQuery,
) => {
  let school = {};

  const schoolData = await prisma.school.findUnique({
    where: { id },
    select: { id: true },
  });

  const schoolSchema = SchoolReturnSchema.parse(
    await schoolReturn(schoolData.id, year_id),
  );

  school = { ...school, ...schoolSchema };

  if (year_id && class_id) {
    const classData = await classYearReturn(class_id, id, year_id);
    school = { ...school, class: classData };
  }

  return school;
};
