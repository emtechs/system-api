import { IDash, IRole, ISchoolData } from '../../interfaces';

export const schoolClassReturn = (schoolData: ISchoolData) => {
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

  school = {
    ...school,
    id: schoolData.school.id,
    label: schoolData.school.name,
    name: schoolData.school.name,
    is_active: schoolData.school.is_active,
    classes: schoolData.school._count.classes,
    students: schoolData._count.students,
    frequencies: schoolData._count.frequencies,
    servers: schoolData.school._count.servers,
    infrequency,
  };

  return school;
};

export const schoolServerClassReturn = (
  schoolData: ISchoolData,
  role: IRole,
  dash: IDash,
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

  school = {
    ...school,
    id: schoolData.school.id,
    label: schoolData.school.name,
    name: schoolData.school.name,
    is_active: schoolData.school.is_active,
    classes: schoolData.school._count.classes,
    students: schoolData._count.students,
    frequencies: schoolData._count.frequencies,
    servers: schoolData.school._count.servers,
    infrequency,
  };

  return { role, dash, school };
};

export const schoolClassArrayReturn = (schoolsData: ISchoolData[]) => {
  const schools = schoolsData.map((el) => schoolClassReturn(el));

  return schools;
};

export const classesArrSchoolClassReturn = (
  schoolsData: {
    classes: ISchoolData[];
  }[],
) => {
  const schools: ISchoolData[] = [];

  schoolsData.forEach((el) => {
    el.classes.forEach((el) => schools.push(el));
  });

  return schoolClassArrayReturn(schools);
};

export const serverArrSchoolClassReturn = (
  schoolsData: {
    school: {
      classes: ISchoolData[];
    };
  }[],
) => {
  const schools: ISchoolData[] = [];

  schoolsData.forEach((el) => {
    el.school.classes.forEach((el) => schools.push(el));
  });

  return schoolClassArrayReturn(schools);
};
