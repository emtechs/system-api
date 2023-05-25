import { importSchool, loadSchool } from '../../scripts';

export const importSchoolService = async (file: Express.Multer.File) => {
  const schools = await loadSchool(file);

  return await importSchool(schools);
};
