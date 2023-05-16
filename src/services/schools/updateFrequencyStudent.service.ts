import { IFrequencyStudentUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateFrequencyStudentService = async (
  { justification, status, updated_at }: IFrequencyStudentUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequencyStudent.update({
    where: { id },
    data: { justification, status, updated_at },
    include: { frequency: true, student: true },
  });

  return frequency;
};
