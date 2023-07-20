import { IClassQuery } from '../../interfaces';
import { studentReturnData } from '../../scripts';

export const retrieveClassYearService = async (
  key: string,
  { view, name }: IClassQuery,
) => {
  if (view === 'student') return await studentReturnData(name, key);
};
