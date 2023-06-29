export const schoolClassReturn = (schoolData: {
  school: {
    id: string;
    name: string;
    is_active: boolean;
    director: {
      name: string;
      id: string;
      cpf: string;
    };
    infrequencies: {
      value: number;
    }[];
    _count: {
      classes: number;
      servers: number;
    };
  };
  _count: {
    frequencies: number;
    students: number;
  };
}) => {
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

export const schoolClassArrayReturn = (
  schoolsData: {
    school: {
      id: string;
      name: string;
      is_active: boolean;
      director: {
        name: string;
        id: string;
        cpf: string;
      };
      infrequencies: {
        value: number;
      }[];
      _count: {
        classes: number;
        servers: number;
      };
    };
    _count: {
      frequencies: number;
      students: number;
    };
  }[],
) => {
  const schools = schoolsData.map((el) => schoolClassReturn(el));

  return schools;
};
