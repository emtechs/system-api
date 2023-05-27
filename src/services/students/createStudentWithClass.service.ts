import prisma from '../../prisma';
import { IStudentWithClassRequest } from '../../interfaces';

export const createStudentWithClassService = async (
  { name, registry, class_id, school_id }: IStudentWithClassRequest,
  school_year_id: string,
) => {
  const student = await prisma.student.create({
    data: {
      name,
      registry,
    },
  });

  const classSchool = await prisma.classSchool.findUnique({
    where: {
      class_id_school_id_school_year_id: {
        class_id,
        school_id,
        school_year_id,
      },
    },
  });

  if (!classSchool) {
    await prisma.classSchool.create({
      data: { class_id, school_id, school_year_id },
    });
  }

  const classStudent = await prisma.classStudent.findUnique({
    where: {
      class_id_school_id_school_year_id_student_id: {
        class_id,
        school_id,
        school_year_id,
        student_id: student.id,
      },
    },
  });

  if (!classStudent) {
    await prisma.classStudent.create({
      data: { class_id, school_id, school_year_id, student_id: student.id },
    });
  }

  return student;
};
