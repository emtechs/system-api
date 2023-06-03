import { ISchoolUpdate } from '../interfaces';
import prisma from '../prisma';

const verifySchool = async ({ id }: ISchoolUpdate, director_id: string) => {
  const school = await prisma.school.update({
    where: { id },
    data: {
      director_id,
      servers: {
        upsert: {
          where: {
            school_id_server_id: { school_id: id, server_id: director_id },
          },
          create: { server_id: director_id, dash: 'SCHOOL', role: 'DIRET' },
          update: { dash: 'SCHOOL', role: 'DIRET' },
        },
      },
    },
  });

  return school;
};

export const updateSchool = async (
  schools: ISchoolUpdate[],
  director_id: string,
) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchool(el, director_id);
  });
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school;
  });
};
