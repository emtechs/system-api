import { ClassYear, ClassStudent, School, Student } from '@prisma/client';
import { parseFrequency } from './calculateFrequency';

const parseFrequencySchool = async (
  id: string,
  year_id: string,
  school_id: string,
) => {
  const frequency = await parseFrequency(id, year_id);

  return {
    ...frequency,
    school_id,
  };
};

const studentsSchoolParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencySchool(el.student_id, year_id, el.school_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};

const infrequencySchool = (
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
    created_at: Date;
  }[],
  school_id: string,
  total_students: number,
) => {
  let some = 0;
  students.forEach((student) => {
    if (student.school_id === school_id) some += student.infrequency;
  });
  return total_students === 0 ? 0 : some / total_students;
};

export const schoolParseFrequency = async (
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
      if (student.school_id === school.id) studentsData.push(student);
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

export const schoolArrParseFrequency = async (
  schools: (School & {
    classes: (ClassYear & {
      students: (ClassStudent & {
        student: Student;
      })[];
    })[];
  })[],
  year_id: string,
) => {
  const studentsData: (ClassStudent & {
    student: Student;
  })[] = [];
  schools.forEach((el) => {
    el.classes.forEach((classes) => {
      classes.students.forEach((student) => studentsData.push(student));
    });
  });

  const students = await studentsSchoolParseFrequency(studentsData, year_id);

  const result = schools.map((el) => {
    const total_students = students.filter(
      (student) => el.id === student.school_id,
    ).length;
    return {
      ...el,
      students: students.filter((student) => el.id === student.school_id),
      infrequency: Number(
        infrequencySchool(students, el.id, total_students).toFixed(2),
      ),
      total_students,
    };
  });

  return result;
};
