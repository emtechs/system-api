import { prisma } from '../../lib'
import { IClassSchoolRequest } from '../../interfaces'

export const createClassSchoolService = async ({
  class_id,
  school_id,
  year_id,
}: IClassSchoolRequest) => {
  let classSchool = await prisma.classYear.findUnique({
    where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
  })

  if (!classSchool)
    classSchool = await prisma.classYear.create({
      data: {
        class_id,
        school_id,
        year_id,
      },
    })

  return classSchool
}
