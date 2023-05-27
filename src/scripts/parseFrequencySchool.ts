import { ClassSchool, ClassStudent, School, Student } from '@prisma/client';
import prisma from '../prisma';

const parseFrequencySchool = async (
  id: string,
  school_year_id: string,
  school_id: string,
) => {
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
    school_id,
  };
};

const studentsSchoolParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  school_year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencySchool(el.student_id, school_year_id, el.school_id);
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
    school_id: string;
    id: string;
    name: string;
    registry: string;
    is_active: boolean;
    justify_disabled: string;
    created_at: Date;
  }[],
  school_id: string,
  total_students: number,
) => {
  let some = 0;
  students.forEach((student) => {
    if (student.school_id === school_id) {
      some += student.infrequency;
    }
  });
  return some / total_students;
};

export const schoolParseFrequency = async (
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
    classes.students.forEach((student) => studentsData.push(student));
  });

  const students = await studentsSchoolParseFrequency(
    studentsData,
    school_year_id,
  );

  const total_students = students.filter(
    (student) => school.id === student.school_id,
  ).length;

  const result = {
    ...school,
    students: students.filter((student) => school.id === student.school_id),
    infrequency: Number(
      infrequencyClass(students, school.id, total_students).toFixed(2),
    ),
    total_students,
  };

  return result;
};

export const schoolArrParseFrequency = async (
  schools: (School & {
    classes: (ClassSchool & {
      students: (ClassStudent & {
        student: Student;
      })[];
    })[];
  })[],
  school_year_id: string,
) => {
  const studentsData: (ClassStudent & {
    student: Student;
  })[] = [];
  schools.forEach((el) => {
    el.classes.forEach((classes) => {
      classes.students.forEach((student) => studentsData.push(student));
    });
  });

  const students = await studentsSchoolParseFrequency(
    studentsData,
    school_year_id,
  );

  const result = schools.map((el) => {
    const total_students = students.filter(
      (student) => el.id === student.school_id,
    ).length;
    return {
      ...el,
      students: students.filter((student) => el.id === student.school_id),
      infrequency: Number(
        infrequencyClass(students, el.id, total_students).toFixed(2),
      ),
      total_students,
    };
  });
  return result;
};
