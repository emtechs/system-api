import prisma from '../../prisma';
import { IFrequencyStudentRequest } from '../../interfaces';
import { UserReturnSchema } from '../../schemas';

export const createFrequencyStudentService = async (
  { student_id, status, justification }: IFrequencyStudentRequest,
  frequency_id: string,
  school_id: string,
) => {
  const frequency = await prisma.frequencyStudent.create({
    data: { frequency_id, student_id, status, justification, school_id },
  });

  return UserReturnSchema.parse(frequency);
};
