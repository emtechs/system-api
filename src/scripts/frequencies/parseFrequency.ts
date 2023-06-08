import {
  Class,
  ClassSchool,
  Frequency,
  FrequencyStudent,
  Prisma,
  School,
  Year,
  StatusStudent,
  Student,
  User,
} from '@prisma/client';
import prisma from '../../prisma';

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

export const freqArrParseFrequency = async (
  frequencies: (Frequency & {
    user: User;
    class: ClassSchool & {
      year: Year;
      school: School;
      class: Class;
    };
    students: (FrequencyStudent & {
      student: Student;
    })[];
    _count: Prisma.FrequencyCountOutputType;
  })[],
) => {
  const studentsData: (FrequencyStudent & {
    student: Student;
  })[] = [];
  frequencies.forEach((el) => {
    el.students.forEach((student) => studentsData.push(student));
  });

  const students = await studentsFreqParseFrequency(studentsData);

  const result = frequencies.map((el) => {
    return {
      ...el,
      students: students.filter((student) => el.id === student.frequency_id),
      infrequency: Number(
        infrequencyFreq(students, el.id, el._count.students).toFixed(2),
      ),
    };
  });
  return result;
};

export const freqParseFrequency = async (
  frequency: Frequency & {
    user: User;
    class: ClassSchool & {
      year: Year;
      school: School;
      class: Class;
    };
    students: (FrequencyStudent & {
      student: Student;
    })[];
    _count: Prisma.FrequencyCountOutputType;
  },
) => {
  const studentsData: (FrequencyStudent & {
    student: Student;
  })[] = [];
  frequency.students.forEach((student) => studentsData.push(student));

  const students = await studentsFreqParseFrequency(studentsData);

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
  };

  return result;
};
