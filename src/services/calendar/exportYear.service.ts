import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportYearService = async () => {
  const years = await prisma.year.findMany({
    select: { year: true, id: true },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/anos.csv');
    const stringifier = stringify({
      header: true,
      columns: ['year', 'id'],
    });
    years.map((year) => {
      stringifier.write(Object.values(year));
    });
    stringifier.pipe(writeStream);
  }

  return years;
};
