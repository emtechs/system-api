import { prisma } from '../../lib'

export const listRequestService = async () => {
  const [request, total] = await Promise.all([
    prisma.request.findMany({
      include: {
        frequency: {
          select: {
            id: true,
            date: true,
            class: {
              select: {
                class: { select: { id: true, name: true } },
                school: { select: { id: true, name: true } },
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            student: { select: { id: true, registry: true, name: true } },
            frequency: {
              select: {
                id: true,
                date: true,
                class: {
                  select: {
                    class: { select: { id: true, name: true } },
                    school: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.request.count(),
  ])

  const result = request.map((el) => {
    let description = ''
    const { id, created_at, justification, user, frequency, student } = el
    if (frequency)
      description = `Reabrir Frequência - ${frequency.date} - ${frequency.class.class.name} - ${frequency.class.school.name}`
    if (student)
      description = `Abonar Falta - ${student.student.registry} - ${student.student.name} - ${student.frequency.date} - ${student.frequency.class.class.name} - ${student.frequency.class.school.name}`
    return { id, description, justification, created_at, user }
  })

  return { total, result }
}
