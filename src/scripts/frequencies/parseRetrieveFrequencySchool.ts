import { ClassYear, ClassStudent, School, Student } from '@prisma/client'
import { parseFrequency } from './calculateFrequency'

const studentsSchoolParseFrequency = async (
  students: (ClassStudent & {
    student: Student
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.student_id, year_id)
  })

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency
  })
}

export const schoolParseRetrieveFrequency = async (
  school: School & {
    classes: (ClassYear & {
      students: (ClassStudent & {
        student: Student
      })[]
    })[]
  },
  year_id: string,
) => {
  const studentsData: (ClassStudent & {
    student: Student
  })[] = []
  school.classes.forEach((classes) => {
    classes.students.forEach((student) => {
      if (school.id === student.school_id) studentsData.push(student)
    })
  })

  const students = await studentsSchoolParseFrequency(studentsData, year_id)

  const total_students = studentsData.length

  let some = 0
  students.forEach((student) => (some += student.infrequency))
  const infrequency = total_students === 0 ? 0 : some / total_students

  const result = {
    ...school,
    students,
    infrequency: Number(infrequency.toFixed(2)),
    total_students,
  }

  return result
}
