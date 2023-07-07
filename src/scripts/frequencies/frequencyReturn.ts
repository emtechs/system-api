import { StatusFrequency } from '@prisma/client';

export const frequencyReturn = (
  frequencies: {
    id: string;
    date: string;
    status: StatusFrequency;
    infrequency: number;
    class: {
      class: {
        id: string;
        name: string;
      };
      school: {
        id: string;
        name: string;
      };
    };
    _count: {
      students: number;
    };
  }[],
) => {
  const freqDataArr = frequencies.map((el) => {
    const { id, date, status, infrequency, class: classData, _count } = el;

    return {
      id,
      date,
      status,
      infrequency,
      students: _count.students,
      school: classData.school,
      class: classData.class,
    };
  });

  return freqDataArr;
};
