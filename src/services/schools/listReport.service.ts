import { Student } from '@prisma/client';
import prisma from '../../prisma';

interface count extends Student {
  _count: {
    frequencies: number;
  };
}

const returnParam = (
  student: Student,
  studentsPresent: count[],
  studentsJustif: count[],
  studentsMiss: count[],
) => {
  const present = studentsPresent.filter((el) => el.id === student.id)[0]._count
    .frequencies;
  const justif = studentsJustif.filter((el) => el.id === student.id)[0]._count
    .frequencies;
  const miss = studentsMiss.filter((el) => el.id === student.id)[0]._count
    .frequencies;
  const total = present + justif + miss;
  const infreqNumb = (miss / total) * 100;
  const infreq = String(infreqNumb.toFixed(2)).replace('.', ',') + '%';
  return { ...student, present, justif, miss, total, infreq };
};

export const listReportService = async (class_id: string) => {
  const students = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    where: { class_id },
  });
  const studentsPresent = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    where: {
      class_id,
    },
    include: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { status: 'CLOSED' },
              status: 'PRESENTED',
            },
          },
        },
      },
    },
  });

  const studentsJustif = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    where: {
      class_id,
    },
    include: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { status: 'CLOSED' },
              status: 'JUSTIFIED',
            },
          },
        },
      },
    },
  });

  const studentsMiss = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    where: {
      class_id,
    },
    include: {
      _count: {
        select: {
          frequencies: {
            where: {
              frequency: { status: 'CLOSED' },
              status: 'MISSED',
            },
          },
        },
      },
    },
  });

  const result = [];

  students.forEach((el) =>
    result.push(returnParam(el, studentsPresent, studentsJustif, studentsMiss)),
  );

  return result;
};
