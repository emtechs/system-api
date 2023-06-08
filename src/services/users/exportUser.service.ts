import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportUserService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      login: true,
      name: true,
      cpf: true,
      role: true,
      dash: true,
    },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/users.csv');
    const stringifier = stringify({
      header: true,
      columns: ['id', 'login', 'name', 'cpf', 'role', 'dash'],
    });

    users.map((user) => {
      stringifier.write(Object.values(user));
    });

    stringifier.pipe(writeStream);
  }

  return users;
};
