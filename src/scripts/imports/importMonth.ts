import { IMonth } from '../../interfaces';
import prisma from '../../prisma';

const verifyMonth = async ({ month, name }: IMonth) => {
  const monthData = await prisma.month.findUnique({ where: { month } });
  let elem = monthData;
  if (!month) {
    elem = await prisma.month.create({ data: { month, name } });
  }
  return elem;
};

export const importMonth = async (months: IMonth[]) => {
  const monthsVerifyParse = months.map((el) => {
    return verifyMonth(el);
  });
  return Promise.all(monthsVerifyParse).then((elem) => {
    return elem;
  });
};
