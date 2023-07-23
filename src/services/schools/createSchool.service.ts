import { prisma } from '../../lib'
import { ISchoolRequest } from '../../interfaces'
import { SchoolReturnSchema } from '../../schemas'

export const createSchoolService = async ({ name }: ISchoolRequest) => {
  const school = await prisma.school.create({
    data: {
      name,
    },
  })

  return SchoolReturnSchema.parse(school)
}
