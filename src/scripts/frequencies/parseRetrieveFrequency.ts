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
import { classParseRetrieveFrequency } from './parseRetrieveFrequencyClass';
import { schoolParseRetrieveFrequency } from './parseRetrieveFrequencySchool';
import {
  frequencyFindUnique,
  justifiedCount,
  missedCount,
  presentedCount,
  studentFindUnique,
} from './calculateFrequency';

const parseFrequencyFreq = async (
  id: string,
  frequencyStudent_id: string,
  year_id: string,
) => {
  const [student, presented, justified, missed, frequency] = await Promise.all([
    studentFindUnique(id),
    presentedCount(id, year_id),
    justifiedCount(id, year_id),
    missedCount(id, year_id),
    frequencyFindUnique(frequencyStudent_id),
  ]);

  const total_frequencies = presented + justified + missed;
  const infrequency =
    total_frequencies === 0 ? 0 : (missed / total_frequencies) * 100;
  const { justification, status, updated_at } = frequency;
  const infreq_stu = status === 'MISSED' ? 100 : 0;

  return {
    ...student,
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

  const [students, classData, school] = await Promise.all([
    studentsFreqParseFrequency(studentsData, year_id),
    classParseRetrieveFrequency(frequency.class, year_id),
    schoolParseRetrieveFrequency(frequency.class.school, year_id),
  ]);

  let some = 0;
  students.forEach((student) => (some += student.infreq_stu));
  const infrequency =
    frequency._count.students === 0 ? 0 : some / frequency._count.students;

  const result = {
    ...frequency,
    students,
    infreq: Number(infrequency.toFixed(2)),
    class_infreq: classData.infrequency,
    school_infreq: school.infrequency,
  };
  return result;
};
