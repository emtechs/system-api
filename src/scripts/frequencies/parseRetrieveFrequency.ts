import {
  Class,
  ClassYear,
  ClassStudent,
  Frequency,
  FrequencyStudent,
  Prisma,
  School,
  Year,
  Student,
  User,
} from '@prisma/client'
import { prisma } from '../../lib'
import { classParseRetrieveFrequency } from './parseRetrieveFrequencyClass'
import { schoolParseRetrieveFrequency } from './parseRetrieveFrequencySchool'
import {
  frequencyFindUnique,
  justifiedCount,
  missedCount,
  presentedCount,
  studentFindUnique,
} from './calculateFrequency'
import { z } from 'zod'

const parseFrequencyFreq = async (
  id: string,
  frequencyStudent_id: string,
  year_id: string,
) => {
  let returnStudent = {}

  const [student, presences, justified, absences, frequency] =
    await Promise.all([
      studentFindUnique(id),
      presentedCount(id, year_id),
      justifiedCount(id, year_id),
      missedCount(id, year_id),
      frequencyFindUnique(frequencyStudent_id),
    ])

  const frequencies = presences + justified + absences
  const infrequency = frequencies === 0 ? 0 : (absences / frequencies) * 100

  if (frequency) {
    const { justification, status, updated_at } = frequency
    const infreq_stu = status === 'MISSED' ? 100 : 0

    returnStudent = {
      ...returnStudent,
      justification,
      status,
      updated_at,
      infreq_stu,
    }
  }

  returnStudent = {
    ...returnStudent,
    ...student,
    frequencyStudent_id,
    presences,
    justified,
    absences,
    frequencies,
    infrequency: Number(infrequency.toFixed(2)),
  }

  const returnStudentSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    registry: z.string(),
    created_at: z.date(),
    frequencyStudent_id: z.string().uuid(),
    presences: z.number(),
    justified: z.number(),
    absences: z.number(),
    frequencies: z.number(),
    infrequency: z.number(),
    justification: z.string().optional(),
    status: z.string().optional(),
    updated_at: z.string().optional(),
    infreq_stu: z.number().default(0),
  })

  return returnStudentSchema.parse(returnStudent)
}

const studentsFreqParseFrequency = async (
  students: (FrequencyStudent & {
    student: Student
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequencyFreq(el.student_id, el.id, year_id)
  })

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency
  })
}

export const freqParseRetrieveFrequency = async (
  frequency: Frequency & {
    _count: Prisma.FrequencyCountOutputType
    user: User
    class: ClassYear & {
      _count: {
        students: number
        frequencies: number
      }
      class: Class
      students: (ClassStudent & {
        student: Student
      })[]
      school: School & {
        classes: (ClassYear & {
          students: (ClassStudent & {
            student: Student
          })[]
        })[]
      }
      year: Year
    }
    students: (FrequencyStudent & {
      student: Student
    })[]
  },
  year_id: string,
) => {
  const studentsData = frequency.students.filter(
    (student) => frequency.id === student.frequency_id,
  )

  const [
    students,
    { infrequency: class_infreq },
    { infrequency: school_infreq },
    school_frequencies,
  ] = await Promise.all([
    studentsFreqParseFrequency(studentsData, year_id),
    classParseRetrieveFrequency(frequency.class, year_id),
    schoolParseRetrieveFrequency(frequency.class.school, year_id),
    prisma.frequency.count({
      where: { year_id, school_id: frequency.school_id, status: 'CLOSED' },
    }),
  ])

  let some = 0
  students.forEach((student) => (some += student.infreq_stu))
  const infrequency =
    frequency._count.students === 0 ? 0 : some / frequency._count.students

  const result = {
    ...frequency,
    students,
    infreq: Number(infrequency.toFixed(2)),
    class_infreq,
    school_frequencies,
    school_infreq,
  }
  return result
}
