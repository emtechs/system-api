import { AppError } from '../../errors'
import { IClassReportRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const reportClassService = async ({
  key_class,
  period_id,
}: IClassReportRequest) => {
  const classData = await prisma.classYear.findUnique({
    where: { key: key_class },
    include: {
      students: {
        select: {
          student_id: true,
        },
        orderBy: { student: { name: 'asc' } },
      },
      class: { select: { id: true, name: true } },
      school: { select: { id: true, name: true } },
      year: { select: { id: true, year: true } },
    },
  })

  if (!classData) throw new AppError('')

  const {
    class_id,
    school_id,
    year_id,
    class: class_data,
    school,
    year,
  } = classData

  const data = await prisma.classYearInfrequency.findUnique({
    where: {
      period_id_class_id_school_id_year_id: {
        class_id,
        school_id,
        year_id,
        period_id,
      },
    },
    select: {
      frequencies: true,
      value: true,
      period: { select: { category: true, id: true, name: true } },
    },
  })

  return {
    result: {
      id: class_data.id,
      name: class_data.name,
      school,
      year,
      frequencies: data?.frequencies,
      infrequency: data?.value,
      period: data?.period,
    },
    students: await studentArrayReturn(classData.students, period_id),
  }
}

const studentArrayReturn = async (
  students: {
    student_id: string
  }[],
  period_id: string,
) => {
  const studentsData = students.map((el) =>
    returnStudent(el.student_id, period_id),
  )

  return Promise.all(studentsData).then((school) => {
    return school
  })
}

const returnStudent = async (student_id: string, period_id: string) => {
  const [studentData, infreq] = await Promise.all([
    prisma.student.findUnique({ where: { id: student_id } }),
    prisma.studentInfrequency.findUnique({
      where: { period_id_student_id: { period_id, student_id } },
    }),
  ])
  return { ...studentData, infreq }
}
