import prisma from '../../prisma';
import { IClassSchoolRequest } from '../../interfaces';

export const createClassSchoolService = async (
  { class_id }: IClassSchoolRequest,
  year_id: string,
  school_id: string,
) => {
  let classSchool = await prisma.classYear.findUnique({
    where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
  });

  if (!classSchool)
    classSchool = await prisma.classYear.create({
      data: {
        class_id,
        school_id,
        year_id,
      },
    });

  return classSchool;
};
