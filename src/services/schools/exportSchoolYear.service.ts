import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportSchoolYearService = async () => {
  const schoolYears = await prisma.schoolYear.findMany({
    select: { year: true, id: true },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/anos.csv');
    const stringifier = stringify({
      header: true,
      columns: ['year', 'id'],
    });
    schoolYears.map((year) => {
      stringifier.write(Object.values(year));
    });
    stringifier.pipe(writeStream);
  }

  return schoolYears;
};
