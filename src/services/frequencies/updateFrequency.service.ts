import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateFrequencyService = async (
  { status, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status, finished_at },
    select: {
      date_time: true,
      year_id: true,
      class_id: true,
      school_id: true,
      students: { select: { student_id: true } },
    },
  });

  return frequency;
};
