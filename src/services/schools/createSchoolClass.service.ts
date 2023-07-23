import { ISchoolClassRequest } from '../../interfaces'
import { updateSchoolClass } from '../../scripts'

export const createSchoolClassService = async (
  { classes }: ISchoolClassRequest,
  school_id: string,
  year_id: string,
) => {
  return await updateSchoolClass(classes, school_id, year_id)
}
