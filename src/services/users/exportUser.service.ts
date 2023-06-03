import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import prisma from '../../prisma';
import 'dotenv/config';

export const exportUserService = async () => {
  const users = await prisma.user.findMany({
    include: { director_school: true },
  });

  if (process.env.APP_URL) {
    const writeStream = fs.createWriteStream('tmp/uploads/users.csv');
    const stringifier = stringify({
      header: true,
      columns: ['login', 'name', 'cpf', 'role', 'dash', 'director_school'],
    });

    users.map((user) => {
      const director_school = user.director_school
        ? user.director_school.name
        : '';

      const userData = {
        login: user.login,
        name: user.name,
        cpf: user.cpf,
        role: user.role,
        dash: user.dash,
        director_school,
      };

      stringifier.write(Object.values(userData));
    });

    stringifier.pipe(writeStream);
  }

  return users;
};
