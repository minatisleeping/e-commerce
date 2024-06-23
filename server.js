const app = require('./src/app')

const PORT = 3055 

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

// process.on('SIGINT', () => {
//   server.close(() => console.log('\nExit Server Express'))
// })