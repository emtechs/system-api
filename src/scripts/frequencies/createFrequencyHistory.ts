import { IFrequencyHistoryCreate } from '../../interfaces'
import { prisma } from '../../lib'

const verifyFrequencyHistory = async (
  { id, status, justification }: IFrequencyHistoryCreate,
  user_id: string,
  created_at: number,
) => {
  const frequencyHistory = await prisma.frequencyHistory.create({
    data: {
      status_student: status,
      created_at,
      frequency_id: id,
      justification,
      user_id,
      status: 'ACCEPTED',
    },
  })

  return frequencyHistory
}

export const createFrequencyHistory = async (
  students: IFrequencyHistoryCreate[],
  user_id: string,
  created_at: number,
) => {
  const frequencyHistoryVerifyParse = students.map((el) => {
    return verifyFrequencyHistory(el, user_id, created_at)
  })
  return Promise.all(frequencyHistoryVerifyParse).then((frequencyHistory) => {
    return frequencyHistory
  })
}
