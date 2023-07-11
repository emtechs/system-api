import { IDash, IRole } from '../../interfaces';
import { schoolReturn } from './schoolReturn';

const schoolServerReturn = async (
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
