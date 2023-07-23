import { IStudentData } from '../../interfaces'
import { prisma } from '../../lib'

export const studentReturn = async (
  studentData: IStudentData,
  year_id: string,
) => {
  const student_id = studentData.id
  let student = {}

  student = {
    ...student,
    ...studentData,
    frequencies: {
      presented: 0,
      justified: 0,
      missed: 0,
      total: 0,
    },
    infrequency: 0,
  }

  const [data, classData, schoolData] = await Promise.all([
    prisma.studentInfrequency.findFirst({
      where: { student_id, period: { year_id, category: 'ANO' } },
    }),
    prisma.class.findFirst({
      where: {
        schools: {
          some: {
            students: { some: { student_id, year_id, is_active: true } },
          },
        },
      },
      select: { id: true, name: true },
    }),
    prisma.school.findFirst({
      where: {
        classes: {
          some: {
            students: { some: { student_id, year_id, is_active: true } },
          },
        },
      },
      select: { id: true, name: true },
    }),
  ])

  if (data)
    student = {
      ...student,
      frequencies: {
        presented: data.presences,
        justified: data.justified,
        missed: data.absences,
        total: data.frequencies,
      },
      infrequency: data.value,
    }

  if (classData)
    student = { ...student, class: { id: classData.id, name: classData.name } }

  if (schoolData)
    student = {
      ...student,
      school: { id: schoolData.id, name: schoolData.name },
    }

  if (classData && schoolData) {
    const { key } = await prisma.classStudent.findUnique({
      where: {
        class_id_school_id_year_id_student_id: {
          class_id: classData.id,
          school_id: schoolData.id,
          year_id,
          student_id: studentData.id,
        },
      },
      select: { key: true },
    })

    student = {
      ...student,
      key,
    }
  }

  return student
}

export const studentArrayReturn = async (
  studentsData: IStudentData[],
  year_id: string,
) => {
  const schools = studentsData.map((el) => studentReturn(el, year_id))

  return Promise.all(schools).then((school) => {
    return school
  })
}
