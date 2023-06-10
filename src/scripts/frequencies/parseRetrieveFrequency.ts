import {
  Class,
  ClassSchool,
  ClassStudent,
  Frequency,
  FrequencyStudent,
  Prisma,
  School,
  Year,
  Student,
  User,
} from '@prisma/client';
import prisma from '../../prisma';
import { classParseRetrieveFrequency } from './parseRetrieveFrequencyClass';
import { schoolParseRetrieveFrequency } from './parseRetrieveFrequencySchool';

const parseFrequencyFreq = async (
  id: string,
  frequencyStudent_id: string,
  year_id: string,
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

  const frequency = await prisma.frequencyStudent.findUnique({
    where: {
      id: frequencyStudent_id,
    },
    select: { status: true, justification: true, updated_at: true },
  });

  const { justification, status, updated_at } = frequency;
  const infreq_stu = status === 'MISSED' ? 100 : 0;

  return {
    ...user,
    status,
    justification,
    updated_at,
    infreq_stu: Number(infreq_stu.toFixed(2)),
    frequencyStudent_id,
    infrequency: Number(infrequency.toFixed(2)),
  };
};

const studentsFreqParseFrequency = async (
  students: (FrequencyStudent & {
    student: Student;
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyFreq(el.student_id, el.id, year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

export const freqParseRetrieveFrequency = async (
  frequency: Frequency & {
    _count: Prisma.FrequencyCountOutputType;
    user: User;
    class: ClassSchool & {
      _count: {
        students: number;
        frequencies: number;
      };
      class: Class;
      students: (ClassStudent & {
        student: Student;
      })[];
      school: School & {
        classes: (ClassSchool & {
          students: (ClassStudent & {
            student: Student;
          })[];
        })[];
      };
      year: Year;
    };
    students: (FrequencyStudent & {
      student: Student;
    })[];
  },
  year_id: string,
) => {
  const studentsData = frequency.students.filter(
    (student) => frequency.id === student.frequency_id,
  );

  const students = await studentsFreqParseFrequency(
    studentsData,
    year_id,
  );

  const classData = await classParseRetrieveFrequency(
    frequency.class,
    year_id,
  );

  const school = await schoolParseRetrieveFrequency(
    frequency.class.school,
    year_id,
  );

  let some = 0;
  students.forEach((student) => (some += student.infreq_stu));
  const infrequency =
    frequency._count.students === 0 ? 0 : some / frequency._count.students;

  const result = {
    ...frequency,
    students,
    infrequency: Number(infrequency.toFixed(2)),
    class_infreq: classData.infrequency,
    infreq: school.infrequency,
  };
  return result;
};
