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
        class_year: { select: { class: { select: { id: true, name: true } } } },
        student: { select: { id: true, name: true, registry: true } },
      },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.classStudent.count({
      where: { school_id, year_id, class_id, is_active: true },
    }),
  ]);

  const result = data.map((el) => {
    const { class_year, key, student } = el;
    const { class: classData } = class_year;
    const { id, name, registry } = student;
    return { id, name, registry, class: classData, key };
  });

  return { total, result };
};
