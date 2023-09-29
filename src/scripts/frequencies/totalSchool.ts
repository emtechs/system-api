import { prisma } from '../../lib'

export const frequencyTotalSchool = async (
  school_id: string,
  year_id: string,
) => {
  return await prisma.frequency.count({
    where: { school_id, year_id, is_open: false },
  })
}
