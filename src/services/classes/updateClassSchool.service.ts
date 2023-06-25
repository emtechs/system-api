import prisma from '../../prisma';
import { IClassSchoolUpdateRequest } from '../../interfaces';

export const updateClassSchoolService = async ({
  class_id,
  school_id,
  year_id,
  class_infreq,
  school_frequencies,
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
      infrequency: class_infreq,
      school: {
        update: {
          infrequencies: {
            upsert: {
              where: { year_id_school_id: { school_id, year_id } },
              create: {
                value: school_infreq,
                frequencies: school_frequencies,
                year_id,
              },
              update: { value: school_infreq, frequencies: school_frequencies },
            },
          },
        },
      },
    },
  });

  return classSchool;
};
