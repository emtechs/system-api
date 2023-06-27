import prisma from '../../prisma';
import { IFrequencyStudentQuery } from '../../interfaces';

export const listFrequencyStudentService = async (
  frequency_id: string,
  { is_alter, isNot_presented, order, by, skip, take }: IFrequencyStudentQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { student: { name: by } };
      break;
    case 'registry':
      orderBy = { student: { registry: by } };
      break;
    }
  }

  if (is_alter) whereData = { ...whereData, updated_at: { not: null } };

  if (isNot_presented)
    whereData = { ...whereData, status: { not: 'PRESENTED' } };

  whereData = { ...whereData, frequency_id };

  const [frequency, frequencies, total] = await Promise.all([
    prisma.frequency.findUnique({
      where: { id: frequency_id },
      select: {
        date: true,
        class: { select: { class: { select: { name: true } } } },
      },
    }),
    prisma.frequencyStudent.findMany({
      take,
      skip,
      where: { ...whereData },
      select: {
        id: true,
        status: true,
        updated_at: true,
        justification: true,
        student: { select: { registry: true, name: true } },
      },
      orderBy,
    }),
    prisma.frequencyStudent.count({
      where: { ...whereData },
    }),
  ]);

  return { total, frequency, result: frequencies };
};
