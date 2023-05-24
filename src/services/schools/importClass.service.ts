import prisma from '../../prisma';
import { loadClasses } from '../../scripts';

export const importClassService = async (
  file: Express.Multer.File,
  school_id: string,
) => {
  const data = await loadClasses(file, school_id);

  const classes = await prisma.class.createMany({
    data,
  });

  return classes;
};
