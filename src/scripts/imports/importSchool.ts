import { ISchool } from '../../interfaces';
import prisma from '../../prisma';

const verifySchool = async ({ name }: ISchool) => {
  const schoolData = await prisma.school.findUnique({ where: { name } });
  let school = schoolData;
  if (!schoolData) {
    school = await prisma.school.create({ data: { name } });
  }
  return school;
};

export const importSchool = async (schools: ISchool[]) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchool(el);
  });
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school;
  });
};
