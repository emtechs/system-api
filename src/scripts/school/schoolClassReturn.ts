import { ISchoolData, ISchoolServerData } from '../../interfaces';
import prisma from '../../prisma';

export const schoolClassReturn = async (
  schoolData: ISchoolData,
  year_id: string,
) => {
  const school_id = schoolData.id;
  let infrequency = 0;

  const [classes, students, frequencies, servers, infreq] = await Promise.all([
    prisma.classSchool.count({ where: { school_id, year_id } }),
    prisma.classStudent.count({
      where: { school_id, year_id, is_active: true },
    }),
    prisma.frequency.count({
      where: { school_id, year_id, status: 'CLOSED' },
    }),
    prisma.schoolServer.count({
      where: { school_id },
    }),
    prisma.schoolInfrequency.findFirst({
      where: { school_id, period: { year_id, category: 'ANO' } },
      select: { value: true },
    }),
  ]);

  if (infreq) infrequency = infreq.value;

  return {
    ...schoolData,
    classes,
    students,
    frequencies,
    servers,
    infrequency,
  };
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

const schoolServerClassReturn = async (
  schoolData: ISchoolServerData,
  year_id: string,
) => {
  const { dash, role, school } = schoolData;
  const school_id = school.id;
  let infrequency = 0;

  const [classes, students, frequencies, servers, infreq] = await Promise.all([
    prisma.classSchool.count({ where: { school_id, year_id } }),
    prisma.classStudent.count({
      where: { school_id, year_id, is_active: true },
    }),
    prisma.frequency.count({
      where: { school_id, year_id, status: 'CLOSED' },
    }),
    prisma.schoolServer.count({
      where: { school_id },
    }),
    prisma.schoolInfrequency.findFirst({
      where: { school_id, period: { year_id, category: 'ANO' } },
      select: { value: true },
    }),
  ]);

  if (infreq) infrequency = infreq.value;

  return {
    role,
    dash,
    school: {
      ...school,
      classes,
      students,
      frequencies,
      servers,
      infrequency,
    },
  };
};

export const schoolServerClassArrayReturn = async (
  schoolsData: ISchoolServerData[],
  year_id: string,
) => {
  const schools = schoolsData.map((el) => {
    return schoolServerClassReturn(el, year_id);
  });

  return Promise.all(schools).then((school) => {
    return school;
  });
};
