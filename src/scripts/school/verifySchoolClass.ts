import { IDash, IRole } from '../../interfaces';

export const verifySchoolClass = (
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
) => {
  let is_dash = false;

  const classesData = school.classes.filter(
    ({ year_id }) => year_id === year_id_data,
  );
  is_dash = classesData.length > 0;

  return { ...school, is_dash };
};

export const verifySchoolClassArr = (
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
) => {
  const verify = schools.map((el) => {
    return verifySchoolClass(el, year_id);
  });
  return verify;
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
