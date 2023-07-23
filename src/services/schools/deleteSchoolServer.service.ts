import { prisma } from '../../lib'

export const deleteSchoolServerService = async (
  school_id: string,
  server_id: string,
) => {
  const schoolServer = await prisma.schoolServer.delete({
    where: { school_id_server_id: { school_id, server_id } },
  })

  if (schoolServer.role === 'DIRET')
    await prisma.school.update({
      where: { id: school_id },
      data: { director: { disconnect: true } },
    })
}
