import { ClassSchool, ClassStudent, School, Student } from '@prisma/client';
import prisma from '../../prisma';

const parseFrequencySchool = async (
  id: string,
  school_year_id: string,
  school_id: string,
  class_id: string,
) => {
  const user = await prisma.student.findUnique({ where: { id } });

  const classData = await prisma.class.findUnique({ where: { id: class_id } });

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
    school_id,
    class: classData,
  };
};

const studentsSchoolParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  school_year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencySchool(
      el.student_id,
      school_year_id,
      el.school_id,
      el.class_id,
    );
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

export const schoolClassParseFrequency = async (
  school: School & {
    classes: (ClassSchool & {
      students: (ClassStudent & {
        student: Student;
      })[];
    })[];
  },
  school_year_id: string,
) => {
  const studentsData: (ClassStudent & {
    student: Student;
  })[] = [];
  school.classes.forEach((classes) => {
    classes.students.forEach((student) => {
      if (student.school_id === school.id) {
        studentsData.push(student);
      }
    });
  });

  const students = await studentsSchoolParseFrequency(
    studentsData,
    school_year_id,
  );

  const total_students = studentsData.length;

  let some = 0;
  students.forEach((student) => (some += student.infrequency));
  const infrequency = total_students === 0 ? 0 : some / total_students;

  const result = {
    ...school,
    students: students.filter((student) => school.id === student.school_id),
    infrequency: Number(infrequency.toFixed(2)),
    total_students,
  };

  return result;
};
