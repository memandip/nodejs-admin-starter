const dbConfig = require('./db.json')
const appEnv = process.env.APP_ENV || 'dev'
const mongoose = require('mongoose')
const { dbUrl } = dbConfig[appEnv]

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'db connection error'))

db.once('open', () => console.log('db connected'))