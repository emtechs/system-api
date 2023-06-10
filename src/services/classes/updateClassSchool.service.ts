import prisma from '../../prisma';
import { IClassSchoolUpdateRequest } from '../../interfaces';

export const updateClassSchoolService = async ({
  class_id,
  school_id,
  year_id,
  class_infreq,
  school_infreq,
}: IClassSchoolUpdateRequest) => {
  const classSchool = await prisma.classSchool.update({
    where: {
      class_id_school_id_year_id: {
        class_id,
        school_id,
        year_id,
      },
    },
    data: {
      infreq: class_infreq,
      school: { update: { infreq: school_infreq } },
    },
  });

  return classSchool;
};
