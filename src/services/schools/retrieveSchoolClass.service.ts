import { AppError } from '../../errors';
import prisma from '../../prisma';
import { schoolClassReturn } from '../../scripts';

export const retrieveSchoolClassService = async (
  id: string,
  year_id: string,
) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const school = await prisma.school.findUnique({ where: { id }, select });

  if (!school) throw new AppError('school not found', 404);

  return await schoolClassReturn(school, year_id);
};
