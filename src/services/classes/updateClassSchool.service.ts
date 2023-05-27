import prisma from '../../prisma';
import { IClassSchoolUpdateRequest } from '../../interfaces';

export const updateClassSchoolService = async ({
  class_id,
  school_id,
  school_year_id,
  class_infreq,
  school_infreq,
}: IClassSchoolUpdateRequest) => {
  const classSchool = await prisma.classSchool.update({
    where: {
      class_id_school_id_school_year_id: {
        class_id,
        school_id,
        school_year_id,
      },
    },
    data: { class_infreq, school: { update: { school_infreq } } },
  });

  return classSchool;
};
