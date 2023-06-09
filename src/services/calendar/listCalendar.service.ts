import prisma from '../../prisma';
import { freqArrParseFrequency } from '../../scripts';

const defineColor = (infreq: number) => {
  if (infreq <= 30) return '#388e3c';

  if (infreq <= 65) return '#f57c00';

  return '#d32f2f';
};

export const listCalendarService = async (
  monthData: string,
  year_id: string,
) => {
  const month = +monthData;
  const frequenciesData = await prisma.frequency.findMany({
    where: { AND: { status: 'CLOSED', month: { month }, year_id } },
    include: {
      _count: true,
      user: true,
      class: { include: { school: true, year: true, class: true } },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
    orderBy: { finished_at: 'desc' },
  });

  const frequencies = frequenciesData.length;

  if (frequencies === 0) {
    return {};
  }

  const frequenciesReturn = await freqArrParseFrequency(frequenciesData);

  const calendar: {
    title: string;
    date: string;
    display: 'list-item';
    color: '#388e3c' | '#f57c00' | '#d32f2f' | '#0288d1';
  }[] = [];

  const dates = [...new Set(frequenciesReturn.map((el) => el.date))];

  dates.forEach((date) => {
    let infrequency = 0;
    let count = 0;
    frequenciesReturn.forEach((el) => {
      if (el.date === date) {
        infrequency += el.infrequency;
        count++;
      }
    });
    const dateData = date.split('/');
    const infreq = infrequency / count;
    calendar.push({
      title: `${infreq}%`,
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: defineColor(infreq),
    });
    calendar.push({
      title: `${count}`,
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: '#0288d1',
    });
  });

  return calendar;
};
