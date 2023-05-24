import prisma from '../../prisma';
import { loadSchool } from '../../scripts';

export const importSchoolService = async (file: Express.Multer.File) => {
  const data = await loadSchool(file);

  const schools = await prisma.school.createMany({
    data,
  });

  return schools;
};
