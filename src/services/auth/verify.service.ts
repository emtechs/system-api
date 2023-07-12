import { AppError } from '../../errors';
import { IQuery, IRequestUser } from '../../interfaces';
import prisma from '../../prisma';
import {
  verifyClass,
  verifyFrequency,
  verifySchool,
  verifyStudent,
  verifyUser,
} from '../../scripts';

export const verifyService = async (
  { id, role }: IRequestUser,
  { class_id, school_id, user_id, frequency_id, student_id }: IQuery,
) => {
  if (user_id) {
    if (role !== 'ADMIN') throw new AppError('Missing permissions', 401);

    return await verifyUser(user_id);
  }

  if (school_id) {
    const server_id = id;

    const server = await prisma.schoolServer.findUnique({
      where: {
        school_id_server_id: {
          school_id,
          server_id,
        },
      },
    });

    if (!server && role !== 'ADMIN')
      throw new AppError('Missing permissions', 401);

    return await verifySchool(school_id);
  }

  if (class_id) return await verifyClass(class_id);

  if (student_id) return await verifyStudent(student_id);

  if (frequency_id) return await verifyFrequency(frequency_id);
};
