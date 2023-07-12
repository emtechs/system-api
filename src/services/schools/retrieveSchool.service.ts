import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { schoolReturn } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id }: ISchoolQuery,
) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const school = await prisma.school.findUnique({
    where: { id },
    select,
  });

  return SchoolReturnSchema.parse(await schoolReturn(school, year_id));
};
