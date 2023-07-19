import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listClassYearService = async (
  key: string,
  { view }: IClassQuery,
) => {
  if (view === 'student') {
    const classData = await prisma.classYear.findUnique({
      where: { key, students: { some: { is_active: true } } },
      include: {
        _count: { select: { students: { where: { is_active: true } } } },
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
        students: {
          select: {
            student: { select: { id: true, name: true, registry: true } },
          },
        },
      },
    });

    const result = classData.students.map((el) => {
      const { id, name, registry } = el.student;
      return {
        id,
        name,
        registry,
        class: classData.class,
        school: classData.school,
      };
    });

    return { total: classData._count.students, result };
  }
};
