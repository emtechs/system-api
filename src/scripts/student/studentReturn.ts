import { IStudentData } from '../../interfaces';
import prisma from '../../prisma';

export const studentReturn = async (
  studentData: IStudentData,
  year_id: string,
) => {
  const student_id = studentData.id;
  let presented = 0;
  let justified = 0;
  let missed = 0;
  let total_frequencies = 0;
  let infrequency = 0;

  const data = await prisma.studentInfrequency.findFirst({
    where: { student_id, period: { year_id, category: 'ANO' } },
  });

  if (data) {
    presented = data.presences;
    justified = data.justified;
    missed = data.absences;
    total_frequencies = data.frequencies;
    infrequency = data.value;
  }

  return {
    ...studentData,
    presented,
    justified,
    missed,
    total_frequencies,
    infrequency,
  };
};

export const studentArrayReturn = async (
  studentsData: IStudentData[],
  year_id: string,
) => {
  const schools = studentsData.map((el) => studentReturn(el, year_id));

  return Promise.all(schools).then((school) => {
    return school;
  });
};
