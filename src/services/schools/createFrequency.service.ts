import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { UserReturnSchema } from '../../schemas';

export const createFrequencyService = async (
  { date }: IFrequencyRequest,
  class_id: string,
) => {
  const frequency = await prisma.frequency.create({
    data: { date, class_id },
  });

  return UserReturnSchema.parse(frequency);
};
