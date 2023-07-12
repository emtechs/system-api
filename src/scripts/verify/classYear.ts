import { AppError } from '../../errors';
import prisma from '../../prisma';

export const verifyClassYear = async (
  class_id: string,
  school_id: string,
  year_id: string,
) => {
  const classYear = await prisma.classYear.findUnique({
    where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
    select: {
      class: { select: { name: true } },
    },
  });

  if (!classYear) throw new AppError('class not found', 404);

  const select = {
    id: class_id,
    label: classYear.class.name,
  };

  return { select };
};
