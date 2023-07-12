import prisma from '../../prisma';
import { IStudentWithClassRequest } from '../../interfaces';

export const createStudentWithClassService = async (
  { name, registry, class_id, school_id }: IStudentWithClassRequest,
  year_id: string,
) => {
  const [student, classSchool] = await Promise.all([
    prisma.student.create({
      data: {
        name,
        registry,
      },
    }),
    prisma.classYear.findUnique({
      where: {
        class_id_school_id_year_id: {
          class_id,
          school_id,
          year_id,
        },
      },
    }),
  ]);

  if (!classSchool)
    await prisma.classYear.create({
      data: { class_id, school_id, year_id },
    });

  const classStudent = await prisma.classStudent.findUnique({
    where: {
      class_id_school_id_year_id_student_id: {
        class_id,
        school_id,
        year_id,
        student_id: student.id,
      },
    },
  });

  if (!classStudent)
    await prisma.classStudent.create({
      data: { class_id, school_id, year_id, student_id: student.id },
    });

  return student;
};
