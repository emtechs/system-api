import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { createFrequencyHistory } from '../../scripts';

export const updateInfrequencyService = async (
  { infrequency }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { infrequency },
    include: { students: true },
  });

  return await createFrequencyHistory(
    frequency.students,
    frequency.user_id,
    frequency.finished_at,
  );
};
