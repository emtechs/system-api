import { classYearReturn } from '../../scripts';

export const retrieveClassYearService = async (
  class_id: string,
  school_id: string,
  year_id: string,
) => {
  return await classYearReturn(class_id, school_id, year_id);
};
