import { IDash, IRole } from '../../interfaces'
import { schoolReturn } from './schoolReturn'

const schoolServerReturn = async (
  schoolServer: {
    role: IRole
    dash: IDash
    school: {
      id: string
    }
  },
  year_id = '',
) => {
  const { dash, role, school } = schoolServer

  const schoolClass = await schoolReturn(school.id, year_id)

  return { dash, role, school: schoolClass }
}

export const schoolServerArrayReturn = async (
  schools: {
    role: IRole
    dash: IDash
    school: {
      id: string
    }
  }[],
  year_id = '',
) => {
  const verify = schools.map((el) => {
    return schoolServerReturn(el, year_id)
  })

  return Promise.all(verify).then((school) => {
    return school
  })
}
