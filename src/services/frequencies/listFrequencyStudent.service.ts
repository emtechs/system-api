import prisma from '../../prisma';

export const listFrequencyStudentService = async () => {
  const frequencies = await prisma.frequencyStudent.findMany({
    include: { frequency: true, student: true },
  });

  return frequencies;
};
