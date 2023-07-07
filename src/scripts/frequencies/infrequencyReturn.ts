import prisma from '../../prisma';

export const infrequencyReturn = async (
  infrequency: {
    id: string;
    name: string;
    date_initial: Date;
    date_final: Date;
  },
  year_id: string,
  school_id: string,
  class_id: string,
  student_id: string,
) => {
  let infreqReturn = undefined;

  if (school_id) {
    const infreq = await prisma.schoolInfrequency.findUnique({
      where: { period_id_school_id: { period_id: infrequency.id, school_id } },
      select: { value: true, frequencies: true },
    });
    if (infreq) infreqReturn = { ...infrequency, ...infreq };
  }

  if (class_id && school_id && year_id) {
    const infreq = await prisma.classSchoolInfrequency.findUnique({
      where: {
        period_id_class_id_school_id_year_id: {
          period_id: infrequency.id,
          school_id,
          class_id,
          year_id,
        },
      },
      select: { value: true, frequencies: true },
    });
    if (infreq) infreqReturn = { ...infrequency, ...infreq };
  }

  if (student_id) {
    const infreq = await prisma.studentInfrequency.findUnique({
      where: {
        period_id_student_id: { period_id: infrequency.id, student_id },
      },
      select: {
        value: true,
        frequencies: true,
        absences: true,
        justified: true,
        presences: true,
      },
    });
    if (infreq) infreqReturn = { ...infrequency, ...infreq };
  }

  return infreqReturn;
};

export const infrequencyArrayReturn = async (
  infrequency: {
    id: string;
    name: string;
    date_initial: Date;
    date_final: Date;
  }[],
  year_id = '',
  school_id = '',
  class_id = '',
  student_id = '',
) => {
  const infreq = infrequency.map((el) =>
    infrequencyReturn(el, year_id, school_id, class_id, student_id),
  );

  return Promise.all(infreq).then((school) => {
    return school;
  });
};
