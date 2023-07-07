import { IDash, IRole } from '../../interfaces';
import prisma from '../../prisma';

export const verifySchoolClass = async (
  school: {
    classes: {
      year_id: string;
    }[];
    id: string;
    name: string;
    is_active: boolean;
    director: {
      id: string;
      cpf: string;
      name: string;
    };
  },
  year_id_data = '',
  server_id = '',
) => {
  let schoolReturn = {};
  let is_dash = false;

  schoolReturn = { ...school };

  const classesData = school.classes.filter(
    ({ year_id }) => year_id === year_id_data,
  );
  is_dash = classesData.length > 0;

  schoolReturn = { ...schoolReturn, is_dash };

  const serverData = await prisma.schoolServer.findUnique({
    where: { school_id_server_id: { school_id: school.id, server_id } },
    select: {
      dash: true,
      role: true,
      server: { select: { id: true, name: true, cpf: true } },
    },
  });

  if (serverData) {
    const { dash, role, server } = serverData;

    schoolReturn = {
      ...schoolReturn,
      server: { id: server.id, name: server.name, cpf: server.cpf, dash, role },
    };
  }

  return schoolReturn;
};

export const verifySchoolClassArr = async (
  schools: {
    classes: {
      year_id: string;
    }[];
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
    return verifySchoolClass(el, year_id, server_id);
  });

  return Promise.all(verify).then((school) => {
    return school;
  });
};

export const verifySchoolServerClass = (
  schoolServer: {
    role: IRole;
    dash: IDash;
    school: {
      classes: {
        year_id: string;
      }[];
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
  year_id_data = '',
) => {
  let is_dash = false;

  const { dash, role, school } = schoolServer;

  const classesData = school.classes.filter(
    ({ year_id }) => year_id === year_id_data,
  );
  is_dash = classesData.length > 0;

  return { dash, role, school: { ...school, is_dash } };
};

export const verifySchoolServerClassArr = (
  schools: {
    role: IRole;
    dash: IDash;
    school: {
      classes: {
        year_id: string;
      }[];
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
    return verifySchoolServerClass(el, year_id);
  });
  return verify;
};
