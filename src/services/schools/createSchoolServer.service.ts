import { ISchoolServerRequest } from '../../interfaces'
import { updateSchoolServer } from '../../scripts'

export const createSchoolServerService = async (
  { schools }: ISchoolServerRequest,
  server_id: string,
) => {
  return await updateSchoolServer(schools, server_id)
}
