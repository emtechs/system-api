import { ClassYear, ClassStudent, School, Student } from '@prisma/client';
import {
  classFindUnique,
  justifiedCount,
  missedCount,
  presentedCount,
  studentFindUnique,
} from './calculateFrequency';

const parseFrequencySchool = async (
  id: string,
  year_id: string,
  school_id: string,
  class_id: string,
) => {
  const [student, classData, presented, justified, missed] = await Promise.all([
    studentFindUnique(id),
    classFindUnique(class_id),
    presentedCount(id, year_id),
    justifiedCount(id, year_id),
    missedCount(id, year_id),
  ]);

  const total_frequencies = presented + justified + missed;
  const infrequency =
    total_frequencies === 0 ? 0 : (missed / total_frequencies) * 100;

  return {
    ...student,
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
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencySchool(
      el.student_id,
      year_id,
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
    classes: (ClassYear & {
      students: (ClassStudent & {
        student: Student;
      })[];
    })[];
  },
  year_id: string,
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

  const students = await studentsSchoolParseFrequency(studentsData, year_id);

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
