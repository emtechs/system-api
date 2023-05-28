import {
  Class,
  ClassSchool,
  ClassStudent,
  Frequency,
  FrequencyStudent,
  Prisma,
  School,
  SchoolYear,
  Student,
  User,
} from '@prisma/client';
import prisma from '../../prisma';
import { classParseRetrieveFrequency } from './parseRetrieveFrequencyClass';
import { schoolParseRetrieveFrequency } from './parseRetrieveFrequencySchool';

const parseFrequencyFreq = async (id: string, frequencyStudent_id: string) => {
  const user = await prisma.student.findUnique({ where: { id } });

  const frequency = await prisma.frequencyStudent.findUnique({
    where: {
      id: frequencyStudent_id,
    },
    select: { status: true, justification: true, updated_at: true },
  });

  const { justification, status, updated_at } = frequency;
  const infrequency = status === 'MISSED' ? 100 : 0;

  return {
    ...user,
    status,
    justification,
    updated_at,
    infrequency: Number(infrequency.toFixed(2)),
    frequencyStudent_id,
  };
};

const studentsFreqParseFrequency = async (
  students: (FrequencyStudent & {
    student: Student;
  })[],
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyFreq(el.student_id, el.id);
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
      school_year: SchoolYear;
    };
    students: (FrequencyStudent & {
      student: Student;
    })[];
  },
  school_year_id: string,
) => {
  const studentsData = frequency.students.filter(
    (student) => frequency.id === student.frequency_id,
  );

  const students = await studentsFreqParseFrequency(studentsData);

  const classData = await classParseRetrieveFrequency(
    frequency.class,
    school_year_id,
  );

  const school = await schoolParseRetrieveFrequency(
    frequency.class.school,
    school_year_id,
  );

  let some = 0;
  students.forEach((student) => (some += student.infrequency));
  const infrequency =
    frequency._count.students === 0 ? 0 : some / frequency._count.students;

  const result = {
    ...frequency,
    students,
    infrequency: Number(infrequency.toFixed(2)),
    class_infreq: classData.infrequency,
    school_infreq: school.infrequency,
  };
  return result;
};
