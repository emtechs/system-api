import {
  Class,
  ClassSchool,
  ClassStudent,
  School,
  SchoolYear,
  Student,
} from '@prisma/client';
import prisma from '../../prisma';

const parseFrequencyClass = async (id: string, school_year_id: string) => {
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
              frequency: { AND: { status: 'CLOSED', school_year_id } },
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
              frequency: { AND: { status: 'CLOSED', school_year_id } },
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
              frequency: { AND: { status: 'CLOSED', school_year_id } },
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

const studentsClassParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  school_year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyClass(el.student_id, school_year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

export const classParseRetrieveFrequency = async (
  classData: ClassSchool & {
    class: Class;
    school: School;
    school_year: SchoolYear;
    students: (ClassStudent & {
      student: Student;
    })[];
    _count: {
      students: number;
      frequencies: number;
    };
  },
  school_year_id: string,
) => {
  const studentsData = classData.students.filter(
    (student) => classData.class_id === student.class_id,
  );

  const students = await studentsClassParseFrequency(
    studentsData,
    school_year_id,
  );

  let some = 0;
  students.forEach((student) => (some += student.infrequency));
  const infrequency =
    classData._count.students === 0 ? 0 : some / classData._count.students;

  const result = {
    ...classData,
    students,
    infrequency: Number(infrequency.toFixed(2)),
  };
  return result;
};
