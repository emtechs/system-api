import { IDash, IRole } from '../../interfaces';
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
) => {
  const school_id = school.id;

  let schoolData = {};
  let is_dash = false;
  let infrequency = 0;

  schoolData = { ...school };

  const [classes, students, frequencies, servers, infreq, serverData] =
    await Promise.all([
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
      prisma.schoolServer.findUnique({
        where: { school_id_server_id: { school_id, server_id } },
        select: {
          dash: true,
          role: true,
          server: { select: { id: true, name: true, cpf: true } },
        },
      }),
    ]);

  if (year_id.length > 0) is_dash = classes > 0;

  if (infreq) infrequency = infreq.value;

  schoolData = {
    ...schoolData,
    is_dash,
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
) => {
  const verify = schools.map((el) => {
    return schoolReturn(el, year_id, server_id);
  });

  return Promise.all(verify).then((school) => {
    return school;
  });
};

export const schoolServerReturn = async (
  schoolServer: {
    role: IRole;
    dash: IDash;
    school: {
      id: string;
      name: string;
      is_active: boolean;
      director: {
        id: string;
        cpf: string;
        name: string;
      };
    };
  },
  year_id = '',
) => {
  const { dash, role, school } = schoolServer;

  const schoolClass = await schoolReturn(school, year_id);

  return { dash, role, school: schoolClass };
};

export const schoolServerArrayReturn = (
  schools: {
    role: IRole;
    dash: IDash;
    school: {
      id: string;
      name: string;
      is_active: boolean;
      director: {
        id: string;
        cpf: string;
        name: string;
      };
    };
  }[],
  year_id = '',
) => {
  const verify = schools.map((el) => {
    return schoolServerReturn(el, year_id);
  });
  return verify;
};
