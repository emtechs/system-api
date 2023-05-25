import { Class, ClassSchool, Student } from '@prisma/client';
import prisma from '../prisma';

export const parseFrequency = async (id: string) => {
  const user = await prisma.student.findUnique({ where: { id } });

  const presentedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
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

  const justifiedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
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

  const missedCount = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
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

  const presented = presentedCount._count.frequencies;
  const justified = justifiedCount._count.frequencies;
  const missed = missedCount._count.frequencies;
  const total_frequencies = presented + justified + missed;
  const infrequency = (missed / total_frequencies) * 100;

  return {
    ...user,
    presented,
    justified,
    missed,
    total_frequencies,
    infrequency,
  };
};

export const studentsParseFrequency = async (students: Student[]) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

const infrequencyClass = (
  students: {
    presented: number;
    justified: number;
    missed: number;
    total_frequencies: number;
    infrequency: number;
    id: string;
    name: string;
    registry: string;
    is_active: boolean;
    justify_disabled: string;
    created_at: Date;
    class_id: string;
    school_id: string;
  }[],
  class_id: string,
  count_students: number,
) => {
  let some = 0;
  students.forEach((student) => {
    if (student.class_id === class_id) {
      some += student.infrequency;
    }
  });
  return some / count_students;
};

export const classParseFrequency = async (
  classData: (ClassSchool & {
    class: Class;
    students: Student[];
    _count: {
      students: number;
      frequencies: number;
    };
  })[],
) => {
  const studentsData: Student[] = [];
  classData.forEach((el) => {
    el.students.forEach((student) => studentsData.push(student));
  });

  const students = await studentsParseFrequency(studentsData);

  const result = classData.map((el) => {
    return {
      ...el,
      students: students.filter((student) => el.class_id === student.class_id),
      infrequency: infrequencyClass(students, el.class_id, el._count.students),
    };
  });
  return result;
};
