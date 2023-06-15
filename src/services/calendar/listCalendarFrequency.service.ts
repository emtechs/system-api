import { ICalendarQuery } from '../../interfaces';
import prisma from '../../prisma';

const defineColor = (infreq: number) => {
  if (infreq <= 30) return '#388e3c';

  if (infreq <= 65) return '#f57c00';

  return '#d32f2f';
};

export const listCalendarFrequencyService = async (
  year_id: string,
  school_id: string,
  class_id: string,
  { take, start_date, end_date }: ICalendarQuery,
) => {
  let date_time = {};
  let dateData: string[];
  let whereData = {};

  if (take) take = +take;

  if (end_date) {
    dateData = end_date.split('/');
    date_time = {
      ...date_time,
      lte: new Date(
        `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      ).toISOString(),
    };
  }

  if (start_date) {
    dateData = start_date.split('/');
    date_time = {
      ...date_time,
      gte: new Date(
        `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      ).toISOString(),
    };
  }

  whereData = {
    ...whereData,
    status: 'CLOSED',
    date_time,
    year_id,
    class_id,
    school_id,
  };

  const frequenciesData = await prisma.frequency.findMany({
    take,
    where: {
      ...whereData,
    },
  });

  const frequencies = frequenciesData.length;

  if (frequencies === 0) {
    return [];
  }

  const calendar: {
    title: string;
    date: string;
    display: 'list-item';
    color: '#388e3c' | '#f57c00' | '#d32f2f' | '#0288d1';
  }[] = [];

  const dates = [...new Set(frequenciesData.map((el) => el.date))];

  dates.forEach((date) => {
    let infrequency = 0;
    let count = 0;
    frequenciesData.forEach((el) => {
      if (el.date === date) {
        infrequency += el.infreq;
        count++;
      }
    });
    dateData = date.split('/');
    const infreq = infrequency / count;
    calendar.push({
      title: infreq.toFixed(0) + '%',
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: defineColor(infreq),
    });
  });

  return calendar;
};
