const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const path = require('path')
const {
    Message
} = require('./src/model')

require('./src/config/dbConnection')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    const message = new Message({
        type: 'test',
        message: 'This is on simple test message.'
    })
    try {
        await message.save()
        res.send('<h1>Test Message Saved.</h1>')
    }   catch(e){
        res.send('<h1>Error: </h1>', JSON.stringify(err))
    }
})

app.listen(port, () => console.log('Express server listening on port 8000'))