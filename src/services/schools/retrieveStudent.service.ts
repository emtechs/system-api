import { parseFrequency } from '../../scripts';

export const retrieveStudentService = async (id: string) => {
  return await parseFrequency(id);
};
