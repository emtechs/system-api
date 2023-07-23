import {
  SortFrequencyHistory,
  StatusFrequencyHistory,
  StatusStudent,
} from '@prisma/client'
import { prisma } from '../../lib'

export const frequencyHistoryReturn = async (frequencies: {
  id: string
  sort: SortFrequencyHistory
  status: StatusFrequencyHistory
  status_student: StatusStudent
  justification: string
  created_at: number
  frequency_id: string
  user_id: string
}) => {
  const freqStu = await prisma.frequencyStudent.findUnique({
    where: { id: frequencies.frequency_id },
  })

  const [freq, student] = await Promise.all([
    prisma.frequency.findUnique({
      where: { id: freqStu.frequency_id },
      select: {
        class_id: true,
        school_id: true,
        date: true,
      },
    }),
    prisma.student.findUnique({
      where: { id: freqStu.student_id },
      select: { id: true, name: true, registry: true },
    }),
  ])

  const [classData, school] = await Promise.all([
    prisma.class.findUnique({
      where: { id: freq.class_id },
      select: { id: true, name: true },
    }),
    prisma.school.findUnique({
      where: { id: freq.school_id },
      select: { id: true, name: true },
    }),
  ])

  return {
    ...frequencies,
    date: freq.date,
    student,
    school,
    class: classData,
  }
}

export const frequencyHistoryArrayReturn = async (
  frequencies: {
    id: string
    sort: SortFrequencyHistory
    status: StatusFrequencyHistory
    status_student: StatusStudent
    justification: string
    created_at: number
    frequency_id: string
    user_id: string
  }[],
) => {
  const freq = frequencies.map((el) => frequencyHistoryReturn(el))

  return Promise.all(freq).then((school) => {
    return school
  })
}
