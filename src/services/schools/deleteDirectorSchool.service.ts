import prisma from '../../prisma';

export const deleteDirectorSchoolService = async (id: string) => {
  const school = await prisma.school.findUnique({ where: { id } });
  await prisma.school.update({
    where: { id },
    data: {
      director: {
        update: {
          work_school: {
            disconnect: {
              school_id_server_id: {
                school_id: id,
                server_id: school.director_id,
              },
            },
          },
        },
        disconnect: true,
      },
    },
  });
};
