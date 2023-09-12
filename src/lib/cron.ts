import { CronJob } from 'cron'
import { createResume } from '../scripts'

export const job = new CronJob('* * */4 * * 1-5', async () => {
  try {
    await createResume()
    console.log('Resumo criado com sucesso')
  } catch (error) {
    console.error('Erro ao criar o resumo:', error)
  }
})
