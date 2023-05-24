import fs from 'node:fs';
import { parse as csvParse } from 'csv-parse';
import 'dotenv/config';
import { IClass } from '../interfaces';

export const loadClasses = (
  file: Express.Multer.File,
  school_id: string,
): Promise<IClass[]> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path);
    const classes: IClass[] = [];
    const parseFile = csvParse({ delimiter: ';' });
    stream.pipe(parseFile);

    parseFile
      .on('data', async (line) => {
        const [name] = line;
        classes.push({
          name,
          school_id,
        });
      })
      .on('end', () => {
        if (process.env.APP_URL) {
          fs.promises.unlink(file.path);
        }
        delete classes[0];
        resolve(classes);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
