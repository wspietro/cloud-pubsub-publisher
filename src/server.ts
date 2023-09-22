import { app } from './app'
import { validatedEnv } from './env'

app.listen({
  host: '0.0.0.0',
  port: validatedEnv.PORT,
}).then(() => {
  console.log('🚀 HTTP Server Running')
})
