import app from './app'
import { env } from './env'

app.listen(env.PORT, () => {
  console.log(`Servidor executando na porta ${env.PORT}.`)
})
