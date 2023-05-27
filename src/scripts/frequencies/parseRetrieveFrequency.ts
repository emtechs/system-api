import {
  Class,
  ClassSchool,
  ClassStudent,
  Frequency,
  FrequencyStudent,
  Prisma,
  School,
  SchoolYear,
  StatusStudent,
  Student,
  User,
} from '@prisma/client';
import prisma from '../../prisma';
import { classParseRetrieveFrequency } from './parseRetrieveFrequencyClass';
import { schoolParseRetrieveFrequency } from './parseRetrieveFrequencySchool';

const parseFrequencyFreq = async (
  id: string,
  frequencyStudent_id: string,
  frequency_id: string,
) => {
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
    frequency_id,
    frequencyStudent_id,
  };
};

const studentsFreqParseFrequency = async (
  students: (FrequencyStudent & {
    student: Student;
  })[],
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyFreq(el.student_id, el.id, el.frequency_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

const infrequencyFreq = (
  students: {
    status: StatusStudent;
    justification: string;
    updated_at: string;
    infrequency: number;
    frequency_id: string;
    frequencyStudent_id: string;
    id: string;
    name: string;
    registry: string;
    is_active: boolean;
    justify_disabled: string;
    created_at: Date;
  }[],
  frequency_id: string,
  count_students: number,
) => {
  let some = 0;
  students.forEach((student) => {
    if (student.frequency_id === frequency_id) {
      some += student.infrequency;
    }
  });
  return some / count_students;
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
  const students = await studentsFreqParseFrequency(frequency.students);

  const classData = await classParseRetrieveFrequency(
    frequency.class,
    school_year_id,
  );

  const school = await schoolParseRetrieveFrequency(
    frequency.class.school,
    school_year_id,
  );

  const result = {
    ...frequency,
    students: students.filter(
      (student) => frequency.id === student.frequency_id,
    ),
    infrequency: Number(
      infrequencyFreq(
        students,
        frequency.id,
        frequency._count.students,
      ).toFixed(2),
    ),
    class_infreq: classData.infrequency,
    school_infreq: school.infrequency,
  };
  return result;
};
