import { compareSync, hashSync } from 'bcryptjs'
import { AppError } from '../../errors'
import { IRole, IUserUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'

export const updateUserService = async (
  id: string,
  {
    name,
    email,
    old_password,
    password,
    role,
    dash,
    is_first_access,
    is_active,
  }: IUserUpdateRequest,
  role_user: IRole,
) => {
  if (role) {
    if (role_user !== 'ADMIN')
      throw new AppError('User is not allowed to change his role', 400)
  }

  if (dash) {
    if (role_user !== 'ADMIN')
      throw new AppError('User is not allowed to change his dash', 400)
  }

  if (is_active) {
    if (role_user !== 'ADMIN')
      throw new AppError('User is not allowed to change his is_active', 400)

    await prisma.schoolServer.deleteMany({ where: { server_id: id } })
  }

  if (old_password && password) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (user) {
      const passwordMatch = compareSync(old_password, user.password)
      if (!passwordMatch) {
        throw new AppError('old password does not match', 400)
      }
      password = hashSync(password, 10)
    }
  } else if (password) password = hashSync(password, 10)

  if (role === 'SERV') {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          role,
          is_active,
          work_school: { deleteMany: { server_id: id } },
        },
        include: { director_school: true },
      })

      if (user.director_school)
        user.director_school.forEach(async (el) => {
          await prisma.school.update({
            where: { id: el.id },
            data: { director: { disconnect: true } },
          })
        })

      return UserReturnSchema.parse(user)
    } catch {
      throw new AppError('user not found', 404)
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        role,
        dash,
        is_first_access,
        is_active,
      },
    })

    return UserReturnSchema.parse(user)
  } catch {
    throw new AppError('user not found', 404)
  }
}
