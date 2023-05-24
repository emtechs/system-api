import fs from 'node:fs';
import { parse as csvParse } from 'csv-parse';
import 'dotenv/config';
import { ISchool } from '../interfaces';

export const loadSchool = (file: Express.Multer.File): Promise<ISchool[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path);
    const schools: ISchool[] = [];
    const parseFile = csvParse({ delimiter: ';' });
    stream.pipe(parseFile);

    parseFile
      .on('data', async (line) => {
        const [name] = line;
        schools.push({
          name,
        });
      })
      .on('end', () => {
        if (process.env.APP_URL) {
          fs.promises.unlink(file.path);
        }
        delete schools[0];
        resolve(schools);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
