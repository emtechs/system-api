import prisma from '../../prisma';

export const schoolReturn = async (
  school: {
    id: string;
    name: string;
    is_active: boolean;
    director: {
      id: string;
      cpf: string;
      name: string;
    };
  },
  year_id = '',
  server_id = '',
  class_id = '',
) => {
  const school_id = school.id;

  let schoolData = {};
  let infrequency = 0;
  let where = {};

  if (year_id) where = { ...where, year_id };
  if (class_id) where = { ...where, class_id };

  where = { ...where, school_id };

  schoolData = { ...school };

  const [classes, students, frequencies, servers, infreq, serverData] =
    await Promise.all([
      prisma.classSchool.count({ where }),
      prisma.classStudent.count({
        where: { ...where, is_active: true },
      }),
      prisma.frequency.count({
        where: { ...where, status: 'CLOSED' },
      }),
      prisma.schoolServer.count({
        where: { school_id },
      }),
      prisma.schoolInfrequency.findFirst({
        where: { school_id, period: { year_id, category: 'ANO' } },
        select: { value: true },
      }),
      prisma.schoolServer.findUnique({
        where: { school_id_server_id: { school_id, server_id } },
        select: {
          dash: true,
          role: true,
          server: { select: { id: true, name: true, cpf: true } },
        },
      }),
    ]);

  if (infreq) infrequency = infreq.value;

  schoolData = {
    ...schoolData,
    classes,
    students,
    frequencies,
    servers,
    infrequency,
  };

  if (serverData) {
    const { dash, role, server } = serverData;

    schoolData = {
      ...schoolData,
      server: { id: server.id, name: server.name, cpf: server.cpf, dash, role },
    };
  }

  return schoolData;
};

export const schoolArrayReturn = async (
  schools: {
    id: string;
    name: string;
    is_active: boolean;
    director: {
      id: string;
      cpf: string;
      name: string;
    };
  }[],
  year_id = '',
  server_id = '',
  class_id = '',
) => {
  const verify = schools.map((el) => {
    return schoolReturn(el, year_id, server_id, class_id);
  });

  return Promise.all(verify).then((school) => {
    return school;
  });
};
