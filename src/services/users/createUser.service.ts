import { hashSync } from 'bcryptjs'
import { prisma } from '../../lib'
import { IUserQuery, IUserRequest } from '../../interfaces'
import { AppError } from '../../errors'
import { ServerSchema, UserReturnSchema } from '../../schemas'
import { updateSchoolDirector, updateSchoolServer } from '../../scripts'

export const createUserService = async (
  { login, name, password, cpf, role, dash, schools }: IUserRequest,
  { allNotServ, school_id, is_server }: IUserQuery,
) => {
  let user = await prisma.user.findUnique({
    where: { login },
  })

  if (schools) {
    if (!user) {
      password = hashSync(password, 10)
      user = await prisma.user.create({
        data: {
          login,
          name,
          password,
          cpf,
        },
      })
    } else {
      await prisma.user.update({
        where: { login },
        data: { is_active: true },
      })
    }

    if (is_server) {
      await updateSchoolServer(schools, user.id)
    } else await updateSchoolDirector(schools, user.id)

    return UserReturnSchema.parse(user)
  }

  if (school_id) {
    if (!user) {
      password = hashSync(password, 10)
      user = await prisma.user.create({
        data: {
          login,
          name,
          password,
          cpf,
        },
      })
    }

    await prisma.school.update({
      where: { id: school_id },
      data: {
        servers: {
          upsert: {
            where: {
              school_id_server_id: { school_id, server_id: user.id },
            },
            create: { server_id: user.id, dash, role },
            update: { dash, role },
          },
        },
      },
    })

    const server = await prisma.schoolServer.findUnique({
      where: { school_id_server_id: { school_id, server_id: user.id } },
      select: {
        role: true,
        dash: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
    })

    return ServerSchema.parse(server)
  }

  switch (role) {
    case 'ADMIN':
      dash = 'ADMIN'
      break
    case 'SECRET':
      dash = 'ORGAN'
      break
    case 'DIRET':
      dash = 'SCHOOL'
      break
  }

  if (allNotServ) {
    if (user) {
      const server = await prisma.user.update({
        where: { id: user.id },
        data: { is_active: true },
      })
      return UserReturnSchema.parse(server)
    }

    password = hashSync(password, 10)

    const server = await prisma.user.create({
      data: {
        login,
        name,
        cpf,
        password,
      },
    })

    return UserReturnSchema.parse(server)
  }

  if (user) throw new AppError('user already exists', 409)

  password = hashSync(password, 10)

  user = await prisma.user.create({
    data: {
      login,
      name,
      password,
      cpf,
      role,
      dash,
    },
  })

  return UserReturnSchema.parse(user)
}
