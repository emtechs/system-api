import { IStatusStudent } from '../interfaces'

export const statusFrequencyPtBr = (status: IStatusStudent) => {
  switch (status) {
    case 'PRESENTED':
      return 'Presente'

    case 'MISSED':
      return 'Faltou'

    case 'JUSTIFIED':
      return 'Justificou'
  }
}
