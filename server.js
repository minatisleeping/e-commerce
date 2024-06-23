const app = require('./src/app')
const { env } = require('./src/configs/environment')

const PORT = env.PORT 

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

// process.on('SIGINT', () => {
//   server.close(() => console.log('\nExit Server Express'))
// })