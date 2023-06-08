import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportStudentService = async () => {
  const students = await prisma.student.findMany({
    include: { classes: { include: { class: { include: { school: true } } } } },
  });

  const studentsData = students.map((el) => {
    return {
      registry: el.registry,
      name: el.name,
      school: el.classes[0] ? el.classes[0].class.school.name : '',
    };
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/estudantes.csv');
    const stringifier = stringify({
      header: true,
      columns: ['registry', 'name', 'school'],
    });
    studentsData.map((student) => {
      stringifier.write(Object.values(student));
    });
    stringifier.pipe(writeStream);
  }

  return studentsData;
};
