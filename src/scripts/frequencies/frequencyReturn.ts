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
  }[],
) => {
  const freqDataArr = frequencies.map((el) => {
    const { id, date, status, infrequency, class: classData } = el;

    return {
      id,
      date,
      status,
      infrequency,
      school: classData.school,
      class: classData.class,
    };
  });

  return freqDataArr;
};
