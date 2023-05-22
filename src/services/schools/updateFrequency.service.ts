import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { parseFrequency } from '../../scripts';

export const updateFrequencyService = async (
  { status }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status },
    include: {
      school: true,
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  frequency.students.forEach(async (el) => await parseFrequency(el.student_id));

  const aggregations = await prisma.student.aggregate({
    where: { class_id: frequency.class_id },
    _avg: { infrequency: true },
  });

  await prisma.class.update({
    where: { id: frequency.class_id },
    data: { infrequency: aggregations._avg.infrequency },
  });

  return frequency;
};
