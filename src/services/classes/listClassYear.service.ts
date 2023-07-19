import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listClassYearService = async (
  key: string,
  { view }: IClassQuery,
) => {
  if (view === 'student') {
    const [students, total, classData] = await Promise.all([
      prisma.classStudent.findMany({
        where: { is_active: true, class_year: { key } },
        select: {
          student: { select: { id: true, name: true, registry: true } },
        },
      }),
      prisma.classStudent.count({
        where: { is_active: true, class_year: { key } },
      }),
      prisma.classYear.findUnique({
        where: { key },
        include: {
          class: { select: { id: true, name: true } },
          school: { select: { id: true, name: true } },
        },
      }),
    ]);

    const result = students.map((el) => {
      const { id, name, registry } = el.student;
      return {
        id,
        name,
        registry,
        class: classData.class,
        school: classData.school,
        year_id: classData.year_id,
      };
    });

    return { total, result };
  }
};
