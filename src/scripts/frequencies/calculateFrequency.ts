import prisma from '../../prisma';

export const studentFindUnique = async (id: string) => {
  return await prisma.student.findUnique({ where: { id } });
};

export const classFindUnique = async (id: string) => {
  return await prisma.class.findUnique({ where: { id } });
};

export const frequencyFindUnique = async (id: string) => {
  return await prisma.frequencyStudent.findUnique({
    where: {
      id,
    },
    select: { status: true, justification: true, updated_at: true },
  });
};

export const presentedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'PRESENTED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const justifiedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'JUSTIFIED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const missedCount = async (student_id: string, year_id: string) => {
  return await prisma.frequencyStudent.count({
    where: {
      student_id,
      status: 'MISSED',
      frequency: { year_id, status: 'CLOSED' },
    },
  });
};

export const parseFrequency = async (id: string, year_id: string) => {
  const [student, presented, justified, missed] = await Promise.all([
    studentFindUnique(id),
    presentedCount(id, year_id),
    justifiedCount(id, year_id),
    missedCount(id, year_id),
  ]);

  const total_frequencies = presented + justified + missed;
  const infrequency =
    total_frequencies === 0 ? 0 : (missed / total_frequencies) * 100;

  return {
    ...student,
    presented,
    justified,
    missed,
    total_frequencies,
    infrequency: Number(infrequency.toFixed(2)),
  };
};

export const schoolFreq = async (school_id: string, period_id: string) => {
  const [aggregate, frequencies] = await Promise.all([
    prisma.frequencyStudent.aggregate({
      _avg: { value: true },
      where: {
        frequency: {
          school_id,
          periods: { some: { period_id } },
          status: 'CLOSED',
        },
      },
    }),
    prisma.frequency.count({
      where: { school_id, periods: { some: { period_id } }, status: 'CLOSED' },
    }),
  ]);

  return await prisma.schoolInfrequency.upsert({
    create: {
      frequencies,
      period_id,
      school_id,
      value: aggregate._avg.value,
    },
    where: { period_id_school_id: { period_id, school_id } },
    update: {
      frequencies,
      value: aggregate._avg.value,
    },
  });
};

export const classFreq = async (
  class_id: string,
  year_id: string,
  school_id: string,
  period_id: string,
) => {
  const [aggregate, frequencies] = await Promise.all([
    prisma.frequencyStudent.aggregate({
      _avg: { value: true },
      where: {
        frequency: {
          school_id,
          class_id,
          year_id,
          periods: { some: { period_id } },
          status: 'CLOSED',
        },
      },
    }),
    prisma.frequency.count({
      where: {
        school_id,
        class_id,
        year_id,
        periods: { some: { period_id } },
        status: 'CLOSED',
      },
    }),
  ]);

  return await prisma.classYearInfrequency.upsert({
    create: {
      frequencies,
      period_id,
      school_id,
      year_id,
      class_id,
      value: aggregate._avg.value,
    },
    where: {
      period_id_class_id_school_id_year_id: {
        class_id,
        period_id,
        school_id,
        year_id,
      },
    },
    update: {
      frequencies,
      value: aggregate._avg.value,
    },
  });
};

export const studentFreq = async (student_id: string, period_id: string) => {
  const [aggregate, frequencies, justified, presences, absences] =
    await Promise.all([
      prisma.frequencyStudent.aggregate({
        _avg: { value: true },
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
          status: 'JUSTIFIED',
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
          status: 'PRESENTED',
        },
      }),
      prisma.frequencyStudent.count({
        where: {
          student_id,
          frequency: { status: 'CLOSED', periods: { some: { period_id } } },
          status: 'MISSED',
        },
      }),
    ]);

  return await prisma.studentInfrequency.upsert({
    create: {
      frequencies,
      period_id,
      justified,
      presences,
      absences,
      value: aggregate._avg.value,
      student_id,
    },
    where: { period_id_student_id: { period_id, student_id } },
    update: {
      frequencies,
      justified,
      presences,
      absences,
      value: aggregate._avg.value,
    },
  });
};
