import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { classYearReturn, schoolReturn } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id, class_id }: ISchoolQuery,
) => {
  let school = {};

  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const schoolData = await prisma.school.findUnique({
    where: { id },
    select,
  });

  const schoolSchema = SchoolReturnSchema.parse(
    await schoolReturn(schoolData, year_id),
  );

  school = { ...school, ...schoolSchema };

  if (year_id && class_id) {
    const classData = await classYearReturn(class_id, id, year_id);
    school = { ...school, class: classData };
  }

  return school;
};
