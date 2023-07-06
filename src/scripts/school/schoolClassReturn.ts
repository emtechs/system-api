import { ISchoolData } from '../../interfaces';
import prisma from '../../prisma';

export const schoolClassReturn = async (
  schoolData: ISchoolData,
  year_id: string,
) => {
  let school = {};
  let infrequency = 0;

  if (schoolData.school.director)
    school = {
      ...school,
      director: {
        id: schoolData.school.director.id,
        name: schoolData.school.director.name,
        cpf: schoolData.school.director.cpf,
      },
    };

  if (schoolData.school.infrequencies.length > 0)
    infrequency = schoolData.school.infrequencies[0].value;

  const [students, frequencies] = await Promise.all([
    prisma.classStudent.count({
      where: { school_id: schoolData.school.id, year_id, is_active: true },
    }),
    prisma.frequency.count({
      where: { school_id: schoolData.school.id, year_id, status: 'CLOSED' },
    }),
  ]);

  school = {
    ...school,
    id: schoolData.school.id,
    label: schoolData.school.name,
    name: schoolData.school.name,
    is_active: schoolData.school.is_active,
    classes: schoolData.school._count.classes,
    students,
    frequencies,
    servers: schoolData.school._count.servers,
    infrequency,
  };

  return school;
};

export const schoolClassArrayReturn = async (
  schoolsData: ISchoolData[],
  year_id: string,
) => {
  const schools = schoolsData.map((el) => schoolClassReturn(el, year_id));

  return Promise.all(schools).then((school) => {
    return school;
  });
};

export const classesArrSchoolClassReturn = async (
  schoolsData: {
    classes: ISchoolData[];
  }[],
  year_id: string,
) => {
  const schools: ISchoolData[] = [];

  schoolsData.forEach((el) => {
    el.classes.forEach((el) => schools.push(el));
  });

  return await schoolClassArrayReturn(schools, year_id);
};

export const serverArrSchoolClassReturn = async (
  schoolsData: {
    school: {
      classes: ISchoolData[];
    };
  }[],
  year_id: string,
) => {
  const schools: ISchoolData[] = [];

  schoolsData.forEach((el) => {
    el.school.classes.forEach((el) => schools.push(el));
  });

  return await schoolClassArrayReturn(schools, year_id);
};
