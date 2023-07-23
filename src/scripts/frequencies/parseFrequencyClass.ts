import {
  Class,
  ClassYear,
  ClassStudent,
  School,
  Year,
  Student,
} from '@prisma/client'
import { parseFrequency } from './calculateFrequency'

const parseFrequencyClass = async (
  id: string,
  year_id: string,
  class_id: string,
) => {
  const frequency = await parseFrequency(id, year_id)

  return {
    ...frequency,
    class_id,
  }
}

const studentsClassParseFrequency = async (
  students: (ClassStudent & {
    student: Student
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyClass(el.student_id, year_id, el.class_id)
  })

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency
  })
}

const infrequencyClass = (
  students: {
    presented: number
    justified: number
    missed: number
    total_frequencies: number
    infrequency: number
    class_id: string
    id: string
    name: string
    registry: string
    created_at: Date
  }[],
  class_id: string,
  count_students: number,
) => {
  let some = 0
  students.forEach((student) => {
    if (student.class_id === class_id) some += student.infrequency
  })
  return some / count_students
}

export const classParseFrequency = async (
  classData: ClassYear & {
    class: Class
    school: School
    year: Year
    students: (ClassStudent & {
      student: Student
    })[]
    _count: {
      students: number
      frequencies: number
    }
  },
  year_id: string,
) => {
  const studentsData = classData.students.filter(
    (student) => classData.class_id === student.class_id,
  )

  const students = await studentsClassParseFrequency(studentsData, year_id)

  let some = 0
  students.forEach((student) => (some += student.infrequency))
  const infrequency =
    classData._count.students === 0 ? 0 : some / classData._count.students

  const result = {
    ...classData,
    students,
    infrequency: Number(infrequency.toFixed(2)),
  }
  return result
}

export const classArrParseFrequency = async (
  classData: (ClassYear & {
    class: Class
    school: School
    year: Year
    students: (ClassStudent & {
      student: Student
    })[]
    _count: {
      students: number
      frequencies: number
    }
  })[],
  year_id: string,
) => {
  const studentsData: (ClassStudent & {
    student: Student
  })[] = []
  classData.forEach((el) => {
    el.students.forEach((student) => studentsData.push(student))
  })

  const students = await studentsClassParseFrequency(studentsData, year_id)

  const result = classData.map((el) => {
    return {
      ...el,
      students: students.filter((student) => el.class_id === student.class_id),
      infrequency: Number(
        infrequencyClass(students, el.class_id, el._count.students).toFixed(2),
      ),
    }
  })
  return result
}
