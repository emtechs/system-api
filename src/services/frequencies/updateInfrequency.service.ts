import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateInfrequencyService = async (
  { infreq }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { infreq },
  });

  return frequency;
};
