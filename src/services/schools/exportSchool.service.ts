import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportSchoolService = async () => {
  const schools = await prisma.school.findMany({
    select: { name: true, id: true },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/escolas.csv');
    const stringifier = stringify({
      header: true,
      columns: ['name', 'id'],
    });
    schools.map((school) => {
      stringifier.write(Object.values(school));
    });
    stringifier.pipe(writeStream);
  }

  return schools;
};
