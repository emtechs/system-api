import { classFreq, schoolFreq, studentFreq } from './calculateFrequency';

export const updateSchoolInfreq = async (
  school_id: string,
  periods: {
    period_id: string;
  }[],
) => {
  const obj: { school_id: string; period_id: string }[] = [];

  periods.forEach(({ period_id }) => {
    obj.push({ period_id, school_id });
  });

  const periodParse = obj.map(({ period_id, school_id }) => {
    return schoolFreq(school_id, period_id);
  });

  return await Promise.all(periodParse);
};

export const updateClassSchoolInfreq = async (
  year_id: string,
  class_id: string,
  school_id: string,
  periods: {
    period_id: string;
  }[],
) => {
  const obj: {
    class_id: string;
    school_id: string;
    year_id: string;
    period_id: string;
  }[] = [];

  periods.forEach(({ period_id }) => {
    obj.push({ class_id, period_id, school_id, year_id });
  });

  const periodParse = obj.map(({ period_id, class_id, school_id, year_id }) => {
    return classFreq(class_id, year_id, school_id, period_id);
  });

  return await Promise.all(periodParse);
};

export const updateStudentInfreq = async (
  students: {
    student_id: string;
  }[],
  periods: {
    period_id: string;
  }[],
) => {
  const obj: { student_id: string; period_id: string }[] = [];

  periods.forEach(({ period_id }) => {
    students.forEach(({ student_id }) => obj.push({ period_id, student_id }));
  });

  const periodParse = obj.map((el) => {
    return studentFreq(el.student_id, el.period_id);
  });

  return await Promise.all(periodParse);
};
