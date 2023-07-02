import { ISchoolUpdate } from '../interfaces';
import prisma from '../prisma';

const verifySchoolDirector = async (
  { id }: ISchoolUpdate,
  director_id: string,
) => {
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

export const updateSchoolDirector = async (
  schools: ISchoolUpdate[],
  director_id: string,
) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchoolDirector(el, director_id);
  });
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school;
  });
};

const verifySchoolServer = async ({ id }: ISchoolUpdate, server_id: string) => {
  const school = await prisma.schoolServer.upsert({
    where: { school_id_server_id: { school_id: id, server_id } },
    create: { school_id: id, server_id },
    update: { dash: 'COMMON', role: 'SERV' },
  });

  return school;
};

export const updateSchoolServer = async (
  schools: ISchoolUpdate[],
  server_id: string,
) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchoolServer(el, server_id);
  });
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school;
  });
};
