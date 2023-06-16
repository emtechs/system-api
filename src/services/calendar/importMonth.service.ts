import { importMonth, loadMonth } from '../../scripts';

export const importMonthService = async (file: Express.Multer.File) => {
  const months = await loadMonth(file);

  return await importMonth(months);
};
