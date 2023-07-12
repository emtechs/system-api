import {
  Class,
  ClassYear,
  ClassStudent,
  School,
  Year,
  Student,
} from '@prisma/client';
import { parseFrequency } from './calculateFrequency';

const studentsClassParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.student_id, year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

export const classParseRetrieveFrequency = async (
  classData: ClassYear & {
    class: Class;
    school: School;
    year: Year;
    students: (ClassStudent & {
      student: Student;
    })[];
    _count: {
      students: number;
      frequencies: number;
    };
  },
  year_id: string,
) => {
  const studentsData = classData.students.filter(
    (student) => classData.class_id === student.class_id,
  );

  const students = await studentsClassParseFrequency(studentsData, year_id);

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
