const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const path = require('path')
const bodyParser = require('body-parser')
const {
    Message
} = require('./src/model')

require('./src/config/dbConnection')
require('./src/config/passport')

app.use(require('cors')())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    const message = new Message({
        type: 'test',
        message: 'This is on simple test message.'
    })
    try {
        await message.save()
        res.send('<h1>Test Message Saved.</h1>')
    } catch (e) {
        res.send('<h1>Error: </h1>', JSON.stringify(err))
    }
})

app.use('/api/user', require('./src/routes/user'))

app.listen(port, () => console.log('Express server listening on port 8000'))