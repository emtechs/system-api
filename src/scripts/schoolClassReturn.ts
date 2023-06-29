export const schoolClassReturn = (
  schoolsData: {
    school: {
      id: string;
      name: string;
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
  const schools = schoolsData.map((el) => {
    let school = {};
    let infrequency = 0;

    if (el.school.director)
      school = {
        ...school,
        director: {
          id: el.school.director.id,
          name: el.school.director.name,
          cpf: el.school.director.cpf,
        },
      };

    if (el.school.infrequencies.length > 0)
      infrequency = el.school.infrequencies[0].value;

    school = {
      ...school,
      id: el.school.id,
      label: el.school.name,
      name: el.school.name,
      classes: el.school._count.classes,
      students: el._count.students,
      frequencies: el._count.frequencies,
      servers: el.school._count.servers,
      infrequency,
    };

    return school;
  });

  return schools;
};
