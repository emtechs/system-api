import { AppError } from '../../errors'
import { IStudentReportRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const reportStudentService = async ({
  key_class,
  period_id,
  student_id,
}: IStudentReportRequest) => {
  const classData = await prisma.classYear.findUnique({
    where: { key: key_class },
    include: {
      frequencies: {
        where: { status: 'CLOSED', students: { some: { student_id } } },
        select: { id: true },
      },
      class: { select: { id: true, name: true } },
      school: { select: { id: true, name: true } },
      year: { select: { id: true, year: true } },
    },
  })

  if (!classData) throw new AppError('')

  const { class: class_data, school, year } = classData

  const data = await prisma.studentInfrequency.findUnique({
    where: {
      period_id_student_id: { period_id, student_id },
    },
  })

  return {
    result: {
      id: class_data.id,
      name: class_data.name,
      school,
      year,
    },
    classData,
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
