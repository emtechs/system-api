import prisma from '../../prisma';

export const studentFindUnique = async (id: string) => {
  return await prisma.student.findUnique({ where: { id } });
};

export const classFindUnique = async (id: string) => {
  return await prisma.class.findUnique({ where: { id } });
};

export const frequencyFindUnique = async (id: string) => {
  return await prisma.frequencyStudent.findUnique({
    where: {
      id,
    },
    select: { status: true, justification: true, updated_at: true },
  });
};

export const presentedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'PRESENTED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const justifiedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'JUSTIFIED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const missedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'MISSED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const parseFrequency = async (id: string, year_id: string) => {
  const [student, presented, justified, missed] = await Promise.all([
    studentFindUnique(id),
    presentedCount(id, year_id),
    justifiedCount(id, year_id),
    missedCount(id, year_id),
  ]);

  const total_frequencies = presented + justified + missed;
  const infrequency =
    total_frequencies === 0 ? 0 : (missed / total_frequencies) * 100;

  return {
    ...student,
    presented,
    justified,
    missed,
    total_frequencies,
    infrequency: Number(infrequency.toFixed(2)),
  };
};
