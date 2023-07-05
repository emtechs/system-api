import { CategoryPeriod } from '@prisma/client';

export const classReturn = (
  classes: {
    class: {
      id: string;
      name: string;
    };
    infrequencies: {
      value: number;
      period: {
        name: string;
        category: CategoryPeriod;
      };
    }[];
    _count: {
      students: number;
      frequencies: number;
    };
  }[],
) => {
  const classDataArr = classes.map((el) => {
    let infrequency = 0;

    el.infrequencies.forEach((el) => {
      if (el.period.category === 'ANO') infrequency = el.value;
    });

    return {
      id: el.class.id,
      label: el.class.name,
      name: el.class.name,
      students: el._count.students,
      frequencies: el._count.frequencies,
      infrequency,
    };
  });

  return classDataArr;
};
