import prisma from '../../../prisma';

export const viewStudent = async (
  school_id: string,
  year_id: string,
  class_id: string,
  name: string,
) => {
  const [data, total] = await Promise.all([
    prisma.classStudent.findMany({
      where: {
        school_id,
        year_id,
        class_id,
        is_active: true,
        student: { name: { contains: name, mode: 'insensitive' } },
      },
      select: {
        key: true,
        year_id: true,
        class_year: {
          select: {
            class: { select: { id: true, name: true } },
            school: { select: { id: true, name: true } },
          },
        },
        student: { select: { id: true, name: true, registry: true } },
      },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.classStudent.count({
      where: {
        school_id,
        year_id,
        class_id,
        is_active: true,
        student: { name: { contains: name, mode: 'insensitive' } },
      },
    }),
  ]);

  const result = data.map((el) => {
    const { class_year, key, student, year_id: year_id_data } = el;
    const { class: classData, school } = class_year;
    const { id, name, registry } = student;
    return {
      id,
      name,
      registry,
      class: classData,
      school,
      year_id: year_id_data,
      key,
    };
  });

  return { total, result };
};
