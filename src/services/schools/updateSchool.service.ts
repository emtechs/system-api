import { hashSync } from 'bcryptjs'
import { ISchoolQuery, ISchoolUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { SchoolReturnSchema } from '../../schemas'
import { AppError } from '../../errors'

export const updateSchoolService = async (
  {
    is_active,
    cpf,
    dash,
    login,
    name,
    name_diret,
    password,
    role,
  }: ISchoolUpdateRequest,
  id: string,
  { director_id }: ISchoolQuery,
) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  }

  if (login) {
    let user = await prisma.user.findUnique({
      where: { login },
    })
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          is_active: true,
        },
      })
    } else if (password && cpf && name_diret) {
      password = hashSync(password, 10)
      user = await prisma.user.create({
        data: { cpf, login, name: name_diret, password },
      })
    }

    if (director_id)
      await prisma.schoolServer.delete({
        where: {
          school_id_server_id: { school_id: id, server_id: director_id },
        },
      })

    if (!user) throw new AppError('')

    const school = await prisma.school.update({
      where: { id },
      data: {
        director_id: user.id,
        servers: {
          upsert: {
            where: {
              school_id_server_id: { school_id: id, server_id: user.id },
            },
            create: { server_id: user.id, dash, role },
            update: { dash, role },
          },
        },
      },
      select,
    })

    return SchoolReturnSchema.parse(school)
  }

  const school = await prisma.school.update({
    where: { id },
    data: { name, is_active },
    select,
  })

  return SchoolReturnSchema.parse(school)
}
