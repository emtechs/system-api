import Mailgen from 'mailgen'
import { env } from '../env'

export const mailGenerator = new Mailgen({
  theme: 'cerberus',

  product: {
    // logo: "",
    name: 'EM Techs',
    link: env.BASE_URL,
  },
})
