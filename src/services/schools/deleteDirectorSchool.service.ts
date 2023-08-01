import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const deleteDirectorSchoolService = async (id: string) => {
  const school = await prisma.school.findUnique({ where: { id } })

  if (!school || !school.director_id) throw new AppError('')

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
  })
}
