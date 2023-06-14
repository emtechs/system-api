import { ClassStudent, Student } from '@prisma/client';
import prisma from '../../prisma';

const parseFrequency = async (id: string, year_id: string) => {
  const user = await prisma.student.findUnique({
    where: { id },
  });

  const presentedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { AND: { status: 'CLOSED', year_id } },
              status: 'PRESENTED',
            },
          },
        },
      },
    },
  });

  const justifiedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { AND: { status: 'CLOSED', year_id } },
              status: 'JUSTIFIED',
            },
          },
        },
      },
    },
  });

  const missedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { AND: { status: 'CLOSED', year_id } },
              status: 'MISSED',
            },
          },
        },
      },
    },
  });

  const presented = presentedCount._count.frequencies;
  const justified = justifiedCount._count.frequencies;
  const missed = missedCount._count.frequencies;
  const total_frequencies = presented + justified + missed;
  const infrequency =
    total_frequencies === 0 ? 0 : (missed / total_frequencies) * 100;

  return {
    ...user,
    presented,
    justified,
    missed,
    total_frequencies,
    infrequency: Number(infrequency.toFixed(2)),
  };
};

export const studentClassParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.student_id, year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};
