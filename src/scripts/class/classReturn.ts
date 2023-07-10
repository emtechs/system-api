import prisma from '../../prisma';

export const classReturn = async (classData: {
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}) => {
  const class_id = classData.id;

  const [schools, students, frequencies] = await Promise.all([
    prisma.school.count({ where: { classes: { every: { class_id } } } }),
    prisma.student.count({ where: { classes: { some: { class_id } } } }),
    prisma.frequency.count({ where: { class_id, status: 'CLOSED' } }),
  ]);

  return { ...classData, schools, students, frequencies };
};

export const classArrayReturn = async (
  classData: {
    id: string;
    name: string;
    is_active: boolean;
    created_at: Date;
  }[],
) => {
  const classes = classData.map((el) => classReturn(el));

  return Promise.all(classes).then((school) => {
    return school;
  });
};
