import prisma from '../../prisma';
import { IFrequencyStudentQuery } from '../../interfaces';
import { FrequencyStudentArraySchema } from '../../schemas';

export const listFrequencyStudentService = async (
  frequency_id: string,
  { is_alter, isNot_presented, order, by }: IFrequencyStudentQuery,
) => {
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

  const [frequencies, total] = await Promise.all([
    prisma.frequencyStudent.findMany({
      where: { ...whereData },
      include: { frequency: true, student: true },
      orderBy,
    }),
    prisma.frequencyStudent.count({
      where: { ...whereData },
    }),
  ]);

  const frequencySchema = FrequencyStudentArraySchema.parse(frequencies);

  return { total, result: frequencySchema };
};
