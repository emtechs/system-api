import { AppError } from '../../errors'
import { ISchoolQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { SchoolReturnSchema } from '../../schemas'
import {
  classYearReturn,
  schoolReturn,
  viewClass,
  viewServer,
} from '../../scripts'

export const retrieveSchoolService = async (
  id: string,
  { year_id, class_id, view, name }: ISchoolQuery,
) => {
  if (view) {
    switch (view) {
      case 'class':
        return await viewClass(id, year_id, name)

      case 'server':
        return await viewServer(id, name)
    }
  }

  let school = {}

  const schoolData = await prisma.school.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!schoolData) throw new AppError('')

  const schoolSchema = SchoolReturnSchema.parse(
    await schoolReturn(schoolData.id, year_id),
  )

  school = { ...school, ...schoolSchema }

  if (year_id && class_id) {
    const classData = await classYearReturn(class_id, id, year_id)
    school = { ...school, class: classData }
  }

  return school
}
