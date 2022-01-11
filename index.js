const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
const PORT = config.get('port') || 4444

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/events', require('./routes/events.routes'))

const start = async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`App has been started! Port: ${PORT}`))
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

start()


