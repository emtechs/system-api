import { importClass, loadClasses } from '../../scripts';

export const importClassService = async (file: Express.Multer.File) => {
  const classes = await loadClasses(file);

  return await importClass(classes);
};
