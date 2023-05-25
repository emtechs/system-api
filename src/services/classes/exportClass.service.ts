import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportClassService = async () => {
  const classes = await prisma.class.findMany({
    select: { name: true, id: true },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/turmas.csv');
    const stringifier = stringify({
      header: true,
      columns: ['name', 'id'],
    });
    classes.map((class_data) => {
      stringifier.write(Object.values(class_data));
    });
    stringifier.pipe(writeStream);
  }

  return classes;
};
